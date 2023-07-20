require("dotenv").config();
const express = require("express");
const compression = require("compression");
const cors = require("cors");

const router = require("./routes");
const { db, connectMessageQue } = require("./config");
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

  app.use(router);

  app.use(errorLogger);
  app.use(errorResponder);
  app.use(invalidPathHandler);
  app.get("/error", (req, res) => {
    res.send("The endpoint you are trying to reach does not exist.");
  });

  app.listen(process.env.PORT, () => {
    console.log(`Experiment Service running on ${process.env.PORT}`);
  });
}

db()
  .then(async() => {
    bootstrap();
    await connectMessageQue();
  })
  .catch((err) => {
    console.error(err);
  });