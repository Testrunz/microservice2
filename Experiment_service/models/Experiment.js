const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExperimentSchema = new Schema({
  procedureId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["viewed", "opened", "closed"],
    default: "opened",
  },
  datas: {
    type: String,
  },
  grade: {
    type: String,
  },
  remark: {
    type: String,
  },
  expresult: {
    type: String,
  },
  shareWith: [
    {
      userId: String,
      date: String,
    },
  ],
});

module.exports = Experiment = mongoose.model("experiment", ExperimentSchema);
