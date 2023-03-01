require("dotenv").config();
const express = require("express");
const compression = require("compression");
const cors = require("cors");

const router = require("./routes");
const { db, redisConnect, connectMessageQue } = require("./config");
const {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} = require("./middleware");

function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: "100mb" }));
  app.use(express.urlencoded({ extended: true }));

  
  app.use(errorLogger);
  app.use(errorResponder);
  app.use(invalidPathHandler);
  
  app.use(router);
  
  app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Auth Service running on ${process.env.PORT}`);
  });
}

db()
  .then(async () => {
    bootstrap();
   // await connectMessageQue();
    //amqClt.sendToQueue(process.env.RABBIT_MQ_AUTH_QUEUE, Buffer.from('something to do'));
   // amqClt.purgeQueue(process.env.RABBIT_MQ_AUTH_QUEUE, function(err, ok) {console.log(err); console.log(ok);});
   // await redisConnect();
    // rdsCtl.set("key", "value")
    // await rdsCtl.get('key')
    // await rdsCtl.disconnect()
  })
  .catch((err) => {
    console.error(err);
  });
