const mongoose = require("mongoose");
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
    console.log("Institute db Connected");
  });
}

module.exports = { db };
