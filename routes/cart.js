const express = require("express");
const router = express.Router();

const { productSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Product = require("../models/product");

//add product to cart
router.get(
  "/add/:id",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product does not exist");
      res.redirect("/products");
    }
    //if this is the first product being added, then we initialise session cart to an array and push one
    if (typeof req.session.cart === "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        name: product.name,
        qty: 1,
        price: parseFloat(product.price).toFixed(2),
        image: product.image,
      });
    } else {
      const cart = req.session.cart; //cart is set to the already exisiting cart
      var newItem = true;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === product.name) {
          cart[i].qty++;
          newItem = false;
          break; //no need to continue if a match is found
        }
      }
      //if newItem is true
      if (newItem) {
        cart.push({
          name: product.name,
          qty: 1,
          price: parseFloat(product.price).toFixed(2),
          image: product.image,
        });
      }
    }
    // console.log(req.session.cart);
    req.flash("success", "Product added!");
    //if the Referer is set (i.e., the previous page), it'll redirect there. Otherwise, it falls back to /products.
    res.redirect(req.get("Referrer") || "/products");
  })
);

//for checkout page
router.get("/checkout", (req, res) => {
  const cart = req.session.cart;
  res.render("shoppingCart/checkout", { cart });
});

module.exports = router;
