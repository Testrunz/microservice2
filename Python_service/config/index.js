const mongoose = require("mongoose");
const { createClient } = require("redis");
const amqp = require("amqplib");

const User = require("../models/User");
const Runz = require("../models/Runz");

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
    console.log("Python db Connected");
  });
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
    await channel.assertQueue(process.env.RABBIT_MQ_RUNPYTHON);
    channel.consume(process.env.RABBIT_MQ_RUNPYTHON, async (msg) => {
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
        channel.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
    });

    await channel2.assertQueue(process.env.RABBIT_MQ_EXPERIMENTFROM);
    channel2.consume(process.env.RABBIT_MQ_EXPERIMENTFROM, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        const runz = new Runz({ experimntId: data.id, ...data });
        const temp = await runz.save();
        await User.findOneAndUpdate(
          { userId: data.userId },
          { $push: { runzId: temp._id } },
          { new: true }
        );
        channel2.ack(msg);
      } else {
        console.log("Consumer cancelled by server");
      }
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
