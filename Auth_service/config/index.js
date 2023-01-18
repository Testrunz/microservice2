const mongoose = require("mongoose");
const { createClient } = require("redis");

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
    console.log("Auth db Connected");
   });
}

const redisClient = createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
redisClient.on("error", (err) => console.log("Redis Client Error", err));

module.exports = { db, redisClient };
