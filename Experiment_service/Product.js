const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name:  String, 
    description: String,
    price: Number,
    created_by: String,
    created_at: { type: Date, default: Date.now }
  });

module.exports = Product = mongoose.model("product", ProductSchema)