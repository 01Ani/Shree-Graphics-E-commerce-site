const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const { productSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Product = require("../models/product");
const { formToJSON } = require("axios");

//for checkout page
router.get("/checkout", (req, res) => {
  const cart = req.session.cart;

  if (req.session.cart && req.session.cart.length === 0) {
    delete req.session.cart;
    res.redirect(req.get("Referrer") || "/products");
  } else {
    res.render("shoppingCart/checkout", { cart });
  }
});

//add product to cart
router.get(
  "/add/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Product does not exist");
      res.redirect("/products");
    }
    //if this is the first product being added, then we initialise session cart to an array and push one
    if (typeof req.session.cart === "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        _id: product._id,
        name: product.name,
        qty: 1,
        price: parseFloat(product.price).toFixed(2),
        image: product.image,
      });
    } else {
      const cart = req.session.cart; //cart is set to the already exisiting cart
      var newItem = true;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === product._id.toString()) {
          //cart[i]._id → a string, because it's stored in req.session.cart
          //product._id → a Mongoose ObjectId (special object, not a string).
          cart[i].qty++;
          newItem = false;
          break; //no need to continue if a match is found
        }
      }
      //if newItem is true
      if (newItem) {
        cart.push({
          _id: product._id,
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

//for updating product on checkout page
router.get(
  "/update/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Product does not exist");
      res.redirect("/products");
    }

    var cart = req.session.cart;
    var action = req.query.action; //action is coming from checkout.ejs page

    for (let i = 0; i < cart.length; i++) {
      if (cart[i]._id === product._id.toString()) {
        switch (action) {
          case "add":
            cart[i].qty++;
            break;
          case "remove":
            cart[i].qty--;
            if (cart[i].qty < 1) {
              cart.splice(i, 1); //removes that particular cart item when it becomes 0
            }
            if (cart.length === 0) delete req.session.cart;
            break;
          case "clear":
            cart.splice(i, 1); //removes only that particular cart item in the array
            if (cart.length === 0) delete req.session.cart;
            break;
          default:
            console.log("update problem");
            break;
        }
        break;
      }
    }
    req.flash("success", "Cart updated!");
    res.redirect(req.get("Referrer") || "/products");
  })
);

module.exports = router;
