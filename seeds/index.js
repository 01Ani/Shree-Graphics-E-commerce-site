const mongoose = require("mongoose");
const Product = require("../models/product");
const { products } = require("./seedHelpers");
const axios = require("axios");
const product = require("../models/product");

mongoose
  .connect("mongodb://127.0.0.1:27017/sg-ecomwebsite")
  .then(() => {
    console.log("MONGO CONNECTED!");
  })
  .catch((err) => {
    console.log("THERE WAS AN ERROR ON MONGO", err);
  });

sample = (array) => array[Math.floor(Math.random() * array.length)];
//we pass in an array

randomNumInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const seedPrdt = async () => {
  await Product.deleteMany({});
  for (let product of products) {
    const prod = new Product({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: await seedImg(),
      stock: product.stock,
    });
    await prod.save();
  }
};

async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "EqMMAB0dIp1VKlkgePn4xtpz8eKsQUR8-QxL57bjHqI",
        collections: 647,
      },
    });
    return resp.data.urls.small;
  } catch (err) {
    console.error(err);
  }
}

seedPrdt().then(() => {
  mongoose.connection.close();
});
