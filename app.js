const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/product");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const expressError = require("./utils/expressError");
const { productSchema } = require("./schemas");

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  res.locals.products = await Product.find({});
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/sg-ecomwebsite")
  .then(() => {
    console.log("MONGO CONNECTED!");
  })
  .catch((err) => {
    console.log("THERE WAS AN ERROR ON MONGO", err);
  });

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

app.get(
  "/products",
  catchAsync(async (req, res) => {
    const product = await Product.find({});
    res.render("products/index", { product });
  })
);

app.post(
  "/products",
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

app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.get(
  "/products/:id",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/show", { product });
  })
);

app.put(
  "/products/:id",
  validateProduct,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {
      ...req.body.product,
    });
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  catchAsync(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  })
);

app.get(
  "/products/:id/edit",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new expressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  // const { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
