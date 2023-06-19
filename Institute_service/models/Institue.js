const mongoose = require("mongoose");

//const data = require("../seed/institutes.json")

const instituteSchema = new mongoose.Schema({
  ProcedureName: {
    type: String,
  },
  labtype: {
    type: String,
  },
  department: {
    type: String,
  },
  year: {
    type: Number,
  },
  semester: {
    type: Number,
  },
  category: {
    type: String,
  },
  university: {
    type: String,
  },
  institute: {
    type: String,
  },
});

module.exports = Institute = mongoose.model("Institute", instituteSchema);

 //Institute.insertMany(data)
