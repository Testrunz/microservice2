const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExperimentSchema = new Schema({
  procedureId: {
    type: String,
    required: true,
  },
  procedurename: {
    type: String,
  },
  testobjective: {
    type: String,
  },
  dueDate:{
    type: Date,
  },
  status: {
    type: String,
    enum: ["not started", "opened", "completed"],
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
  assignTo: [
    {
      userId: String,
      date: String,
    },
  ],
}, { timestamps: true });

module.exports = Experiment = mongoose.model("experiment", ExperimentSchema);
