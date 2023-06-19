const mongoose = require("mongoose");
const { Schema } = mongoose;

//const data = require("../seed/inventories.json")

const InventorySchema = new Schema(
  {
    name: String,
    img: {
      type: String,
      default:
        "data:image/png;base64,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",
    },
    modelNo: String,
    serialNo: String,
    location: String,
    relatedlines: String,
    relatedSite: String,
    metaRunning: { type: Number, default: 0 },
    noofalert: { type: Number, default: 0 },
    metaAlertWeek: { type: Number, default: 0 },
    metaAvail: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = Inventory = mongoose.model("inventory", InventorySchema);

//Inventory.insertMany(data)