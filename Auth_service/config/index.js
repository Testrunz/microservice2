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

const redisClient = createClient({
  socket: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST },
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectMessageQue() {
  try {
    connection = await amqp.connect(
      `amqp://${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`,
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

module.exports = { db, redisClient, connectMessageQue };
