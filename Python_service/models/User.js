const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  codeId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'code'
    }
  ]
});

module.exports = User = mongoose.model("user", UserSchema);
