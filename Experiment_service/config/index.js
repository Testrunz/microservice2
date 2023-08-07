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
    console.log("Experiment db Connected");
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
    await channel.assertQueue(process.env.RABBIT_MQ_EXPERIMENT);
    channel.consume(process.env.RABBIT_MQ_EXPERIMENT, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        if (!data.type) {
          await User.findOneAndUpdate(
            { userId: data.id, email: data.email },
            {
              userId: data.id,
              userCounter: data.counter,
              name: data.name,
              email: data.email,
              role: data.role,
              organization: data.organization,
              department: [data.department],
              labtype: [data.laboratory],
            },
            { upsert: true, new: true }
          );

          channel.ack(msg);
        }
        if (data.type === "createuser") {
          const { type, ...remaining } = data;
          await User.create({ ...remaining });
          channel.ack(msg);
        }
        if (data.type === "removeuser") {
          channel.ack(msg);
        }
      } else {
        console.log("Consumer cancelled by server");
      }
    });
    return channel2;
  } catch (err) {
    console.error(err);
  }
}

const redisClient = createClient({
  socket: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST },
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

module.exports = { db, connectMessageQue, redisClient };
