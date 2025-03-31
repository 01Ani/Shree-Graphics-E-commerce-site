const express = require("express");
const router = express.Router();

const { productSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Product = require("../models/product");

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
    const product = await Product.find({});
    res.render("products/index", { product });
  })
);

router.post(
  "/",
  validateProduct,
  catchAsync(async (req, res) => {
    // if (!req.body.product) throw new expressError("Invalid Product", 400);
    //above is basic for everything, instead we implement joi validation for each

    const product = new Product(req.body.product);
    await product.save();
    res.redirect(`/products/${product._id}`);
    // res.send(req.body);
  })
);

router.get("/new", (req, res) => {
  res.render("products/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
  })
);

router.put(
  "/:id",
  validateProduct,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {
      ...req.body.product,
    });
    res.redirect(`/products/${product._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  })
);

module.exports = router;
