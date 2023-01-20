const mongoose = require("mongoose");
const { createClient } = require("redis");
const amqp = require("amqplib");

const User = require("../model/User")

let channel, connection;

mongoose.set("strictQuery", false);

async function db() {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on('error', function (err) {
      console.error(err);
     });
    mongoose.connection.on('connected', function () {
      console.log("Feedback db Connected");
     });
  }
  async function connectMessageQue() {
    try {
      connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`, (err, conn) => {
        if (err) throw err;
        return conn;
      });
      console.log("Messaging system started");
      channel = await connection.createChannel();
      await channel.assertQueue("FEEDBACK:USER");
      channel.consume("FEEDBACK:USER", (data) => {
        const user = JSON.parse(data.content);
        console.log("Feedback user", user);
        const newUser = new User({
          _id: mongoose.Types.ObjectId(user._id),
          name: user.name,
          email: user.email,
        });
        newUser.save();
        channel.ack(data);
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  const redisClient = createClient({
    socket: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST },
  });
  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  module.exports = { db, connectMessageQue, redisClient };