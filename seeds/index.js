const mongoose = require("mongoose");
const Product = require("../models/product");
const { types, materials } = require("./seedHelpers");

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
  for (let i = 0; i < 50; i++) {
    const prod = new Product({
      title: `${sample(types)} `,
      material: `${sample(materials)}`,
      quantity: randomNumInterval(50, 500),
    });
    await prod.save();
  }
};

seedPrdt().then(() => {
  mongoose.connection.close();
});
