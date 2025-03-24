const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductSchema = new schema({
  title: String,
  material: String,
  quantity: Number,
  price: Number,
  image: String,
  description: String,
});

module.exports = mongoose.model("Product", ProductSchema);
