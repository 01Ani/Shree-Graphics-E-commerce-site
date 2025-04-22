const Category = require("../models/category");
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const mongoose = require("mongoose");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const categoryList = await Category.find({});
    if (!categoryList) {
      req.flash("error", "Category does not exist");
      res.redirect("/products");
    }
    res.send(categoryList);
  })
);

router.post(
  "/",
  catchAsync(async (req, res) => {
    let category = new Category({
      name: req.body.name,
    });
    await category.save();

    if (!category) {
      req.flash("error", "The category cannot be created");
    }
    res.send(category);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Product does not exist");
      return res.redirect("/products");
    }

    const category = await Category.findById(id);
    if (!category) {
      req.flash("error", "Category does not exist");
      res.redirect("/products");
    }
    res.send(category);
    // res.render("products/show", { product });
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
      req.flash("error", "Category does not exist");
      return res.redirect("/products");
    }

    const category = await Category.findByIdAndUpdate(id, {
      ...req.body.category,
    });
    req.flash("success", "Successfully updated category!");
    // res.redirect(`/products/${product._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Category does not exist");
      return res.redirect("/products");
    }

    await Category.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted category!");
    res.redirect("/products");
  })
);

module.exports = router;
