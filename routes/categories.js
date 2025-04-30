const express = require("express");
const router = express.Router();

const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const { categorySchema } = require("../schemas");
const { isLoggedIn } = require("../middleware.js");
const mongoose = require("mongoose");

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const category = await Category.find({});

    if (!category) {
      req.flash("error", "Categories not found");
      return res.redirect("/categories");
    }

    res.render("categories/index", { category });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCategory,
  catchAsync(async (req, res) => {
    let category = new Category({
      name: req.body.category.name,
    });
    await category.save();

    if (!category) {
      req.flash("error", "The category cannot be created");
      return res.redirect("/categories");
    }

    req.flash("success", "Successfully created category!");
    res.redirect(`/categories/${category._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("categories/new");
});

router.get(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Category does not exist");
      return res.redirect("/categories");
    }

    const category = await Category.findById(id);
    if (!category) {
      req.flash("error", "Categorys does not exist");
      return res.redirect("/categories");
    }
    res.render("categories/show", { category });
    // res.render("products/show", { product });
  })
);

router.put(
  "/:id",
  validateCategory,
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Category does not exist");
      return res.redirect("/categories");
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: req.body.category.name,
      },
      { new: true } //return the new updated data rather than the old one...can be seen on postman
    );
    if (!category) {
      req.flash("error", "Categorysy does not exist");
      return res.redirect("/categories");
    }
    req.flash("success", "Successfully updated category!");
    res.redirect(`/categories/${category._id}`);
    // res.redirect(`/products/${product._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //below is done to throw error message when product gets the cast to object id error
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Category does not exist");
      return res.redirect("/categories");
    }

    await Category.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted category!");
    res.redirect("/categories");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Category does not exist");
      return res.redirect("/categories");
    }

    const category = await Category.findById(id);
    if (!category) {
      req.flash("error", "Product does not exist, cannot edit!");
      return res.redirect("/categories");
    }
    res.render("categories/edit", { category });
  })
);

module.exports = router;
