const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductSchema = new schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  image: String,
  stock: Number,
});

module.exports = mongoose.model("Product", ProductSchema);
