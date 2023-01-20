const mongoose = require("mongoose");
const amqp = require("amqplib");


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
      await channel.assertQueue("PROCEDURE:USER");
      channel.consume("PROCEDURE:USER", (data) => {
        const user = JSON.parse(data.content);
        console.log("Procedure user", user);
        channel.ack(data);
      });
    } catch (err) {
      console.error(err);
    }
  }
  module.exports = { db, connectMessageQue };