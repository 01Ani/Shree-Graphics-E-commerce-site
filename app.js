const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/product");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect("mongodb://127.0.0.1:27017/sg-ecomwebsite")
  .then(() => {
    console.log("MONGO CONNECTED!");
  })
  .catch((err) => {
    console.log("THERE WAS AN ERROR ON MONGO", err);
  });

// app.get("/makeproduct", async (req, res) => {
//   const prod = new Product({
//     title: "Letterheads",
//     description: "Make your own custom letterheads",
//   });
//   await prod.save();
//   res.send(prod);
// });

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
