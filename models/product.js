const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductSchema = new schema({
  title: String,
  quantity: Number,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Product", ProductSchema);
