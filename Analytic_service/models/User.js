const mongoose = require("mongoose");
const { Schema } = mongoose;

//const data = require("../seed/users.json")

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
  },
  inventoryIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "inventory",
    },
  ],
});

module.exports = User = mongoose.model("user", UserSchema);

//User.insertMany(data)
