const mongoose = require("mongoose");
const { Schema } = mongoose;

//const data = require("../seed/inventories.json")

const ChartSchema = new Schema(
  {
    type: String,
    mode: String,
    startTime: String,
    endTime: String,
  }
);

module.exports = Chart = mongoose.model("chart", ChartSchema);

//Inventory.insertMany(data)