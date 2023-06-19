const mongoose = require("mongoose");
const { createClient } = require("redis");
const amqp = require("amqplib");

let channel, connection;

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
    console.log("Auth db Connected");
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
    return channel;
  } catch (err) {
    console.error(err);
  }
}

async function purgeMessageQue(queueName) {
  try {
    await channel.purgeQueue(queueName)
  } catch (error) {
    console.error(err);
  }
}

module.exports = { db, redisConnect, connectMessageQue, purgeMessageQue };
