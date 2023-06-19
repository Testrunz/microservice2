const mongoose = require("mongoose");
const { Schema } = mongoose;
const codeSchema = new Schema({
  title: String,
  code: String,
});

module.exports = Code = mongoose.model("code", codeSchema);
