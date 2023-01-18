const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  products: [
    {
      product_id: String,
    },
  ],
  total_price: Number,
  brought_by: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = Order = mongoose.model("order", OrderSchema);
