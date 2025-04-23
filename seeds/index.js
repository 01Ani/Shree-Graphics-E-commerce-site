const mongoose = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const { products } = require("./seedHelpers");
const { categories } = require("./seedHelpers");
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

//function to seed categories
const seedCategories = async () => {
  await Category.deleteMany({});
  for (let category of categories) {
    const cat = new Category({
      name: category,
    });
    await cat.save();
  }
};

const seedPrdt = async () => {
  await Product.deleteMany({});
  for (let product of products) {
    // Find the category by name
    const category = await Category.findOne({ name: product.category });

    if (!category) {
      console.error(`Category not found for product: ${product.name}`);
      continue; // Skip this product if the category doesn't exist
    }

    const prod = new Product({
      name: product.name,
      category: category._id,
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

// Seed the categories and then products
const seedDatabase = async () => {
  await seedCategories(); // Seed categories first
  await seedPrdt(); // Seed products second
  mongoose.connection.close();
};

seedDatabase().then(() => {
  console.log("Database seeded!");
});

// seedPrdt().then(() => {
//   mongoose.connection.close();
// });
