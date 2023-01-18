const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const amqp = require("amqplib");

const Order = require("./Order");

let channel, connection;
async function connectMessageQue() {
  connection = await amqp.connect("amqp://localhost:5672", (err, conn) => {
    if (err) throw err;
    return conn;
  });
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");
}

async function main() {
  await mongoose.set("strictQuery", false);
  await mongoose.connect(
    "mongodb://premnath:Premnath123@127.0.0.1:27017/order?authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
}

async function createOder(data) {
  let total = 0;
  let products = [];
  data.products.forEach((element) => {
    total += element.price;
    products.push({ product_id: element._id });
  });
  const newOder = new Order({
    products,
    total_price: total,
    brought_by: data.user.id,
  });
  newOder.save();
  return newOder;
}

function bootstrap() {
  const app = express();

  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.listen(7001, () => {
    console.log("Order Service running on 7001");
  });
}

main()
  .then(async () => {
    console.log("Db Connected");
    bootstrap();
    await connectMessageQue().then(() => {
      channel.consume("ORDER", async (data) => {
        const { products, user } = JSON.parse(data.content);
        const newOrder = await createOder({ products, user });
        channel.ack(data);
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify(newOrder)));
      });
    });
  })
  .catch((err) => console.log(err));
