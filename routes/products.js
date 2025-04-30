const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const { productSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Product = require("../models/product");
const { isLoggedIn } = require("../middleware.js");

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const product = await Product.find({}).populate("category", "name");
    res.render("products/index", { product });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateProduct,
  catchAsync(async (req, res) => {
    // if (!req.body.product) throw new expressError("Invalid Product", 400);
    //above is basic for everything, instead we implement joi validation for each

    const product = new Product(req.body.product);
    await product.save();
    req.flash("success", "Successfully made a product!");
    res.redirect(`/products/${product._id}`);
    // res.send(req.body);
  })
);

// router.get(
//   "/api",
//   catchAsync(async (req, res) => {
//     const products = await Product.find({}).populate("category", "name");
//     res.send(products); // Sends JSON instead of rendering a page
//   })
// );

router.get("/new", isLoggedIn, (req, res) => {
  res.render("products/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    const product = await Product.findById(id).populate("category", "name");
    if (!product) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }
    res.render("products/show", { product });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateProduct,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    const product = await Product.findByIdAndUpdate(id, {
      ...req.body.product,
    });
    req.flash("success", "Successfully updated product!");
    res.redirect(`/products/${product._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    await Product.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted product!");
    res.redirect("/products");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Product does not exist, cannot edit!");
      return res.redirect("/products");
    }
    res.render("products/edit", { product });
  })
);

module.exports = router;
