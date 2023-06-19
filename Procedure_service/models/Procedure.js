const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProcedureSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true
  },
});

module.exports = Procedure = mongoose.model("procedure", ProcedureSchema);
