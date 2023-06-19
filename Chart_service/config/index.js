const mongoose = require("mongoose");
const { createClient } = require("redis");
const amqp = require("amqplib");
const { InfluxDB } = require("@influxdata/influxdb-client");

const User = require("../models/User");

let channel, connection;

mongoose.set("strictQuery", false);

async function influxDb() {
  const token = process.env.INFLUXTOKEN;
  const org = process.env.INFLUXorg;
  const bucket = process.env.INFLUXbucket;
  const client = new InfluxDB({ url: process.env.INFLUXURL, token: token });
  return new Promise((resolve, reject) => {
    resolve({ client, org, bucket });
    reject(new Error("Error connecting to InfluxDB"));
  });
}

async function db() {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", function (err) {
    console.error(err);
  });
  mongoose.connection.on("connected", function () {
    console.log("Chart db Connected");
  });
}

const redisClient = createClient({
  socket: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST },
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

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
    await channel.assertQueue(process.env.RABBIT_MQ_CHART);
    channel.consume(process.env.RABBIT_MQ_CHART, async (msg) => {
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
          newUser.save();
        }
        channel.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { db, influxDb, redisClient, connectMessageQue };
