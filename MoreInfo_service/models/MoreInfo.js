const mongoose = require("mongoose");
const { Schema } = mongoose;

//const data = require("../seed/moreinfos.json")

const MoreInfoSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
    },
    university: {
      type: String,
    },
    institute: {
      type: String,
    },
    department: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    year: {
      type: Number,
    },
    semester: {
      type: Number,
    },
    showOnce:{
      type: Boolean,
      default: false,
    },
    labtype: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = MoreInfo = mongoose.model("moreInfo", MoreInfoSchema);

//MoreInfo.insertMany(data)
