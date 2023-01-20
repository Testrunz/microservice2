const amqp = require("amqplib");


let channel, connection;

  async function connectMessageQue() {
    try {
      connection = await amqp.connect(`amqp://${process.env.AMQP_HOST}:${process.env.AMQP_PORT}`, (err, conn) => {
        if (err) throw err;
        return conn;
      });
      console.log("Messaging system started");
      channel = await connection.createChannel();
      await channel.assertQueue("PYTHON:USER");
      channel.consume("PYTHON:USER", (data) => {
        const user = JSON.parse(data.content);
        console.log("Python user", user);
        channel.ack(data);
      });
    } catch (err) {
      console.error(err);
    }
  }
  module.exports = {  connectMessageQue };