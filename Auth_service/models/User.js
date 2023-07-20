const mongoose = require("mongoose");
const moment = require("moment-timezone");

//const data = require("../seed/users.json")

const { Schema } = mongoose;

const UserSchema = new Schema({
  activeStatus: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
  },
  firebaseId: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    default: "Asia/Calcutta",
  },
  role: {
    type: String,
    enum: [
      "superadmin",
      "regionaladmin",
      "collegeorinstitueadmin",
      "labadmin",
      "teacher",
      "student",
      "requester",
      "tester",
      "admin",
    ],
    default: "tester",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.virtual("createdAtWithTZ").get(function () {
  return moment(this.createdAt).tz(this.timeZone).format();
});
UserSchema.virtual("updatedAtWithTZ").get(function () {
  return moment(this.updated_at).tz(this.timeZone).format();
});

module.exports = User = mongoose.model("user", UserSchema);

//User.insertMany(data)
