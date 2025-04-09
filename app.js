const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/product");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const expressError = require("./utils/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

//Requiring Routes
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");

mongoose
  .connect("mongodb://127.0.0.1:27017/sg-ecomwebsite")
  .then(() => {
    console.log("MONGO CONNECTED!");
  })
  .catch((err) => {
    console.log("THERE WAS AN ERROR ON MONGO", err);
  });

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

const sessionConfig = {
  secret: "thisshouldbeasecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //set for a week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  next();
});

// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "anirudh@gmail.com", username: "anirudh" });
//   const newUser = await User.register(user, "dogs");
//   res.send(newUser);
// });

//router for products
app.use("/products", productRoutes);
//router for users
app.use("/", userRoutes);
//router for cart
app.use("/cart", cartRoutes);

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
