const mongoose = require("mongoose");
const { createClient } = require("redis");
const amqp = require("amqplib");

const User = require("../models/User");

let channel, channel2, connection;

mongoose.set("strictQuery", false);

async function db() {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", function (err) {
    console.error(err);
  });
  mongoose.connection.on("connected", function () {
    console.log("CodeEditor db Connected");
  });
}

async function redisConnect() {
  const redisClient = createClient({
    url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
  console.log("Redis client connection ", redisClient.isReady);
  return redisClient;
}

async function connectMessageQue() {
  try {
    connection = await amqp.connect(
      `${process.env.RABBIT_MQ_URI}`,
      (err, conn) => {
        if (err) throw err;
        return conn;
      }
    );
    console.log("Messaging system started");
    channel = await connection.createChannel();
    channel2 = await connection.createChannel();
    await channel2.assertQueue(process.env.RABBIT_MQ_CODEEDITOR);
    channel2.consume(process.env.RABBIT_MQ_CODEEDITOR, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        const user = await User.findOne({ userId: data.id, email: data.email });
        if (!user) {
          const newUser = new User({
            userId: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          });
          await newUser.save();
        }
        channel2.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
    return channel;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { db, redisConnect, connectMessageQue };
