const mongoose = require("mongoose");
const { Schema } = mongoose;

const RunzSchema = new Schema({
  experimntId: {
    type: String,
    required: true,
  },
  procedureId: {
    type: String,
    required: true,
  },
  datas: {
    type: String,
  }
});

module.exports = Runz = mongoose.model("runz", RunzSchema);