const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const { blogRouter, authRouter, authorRouter } = require("./src/routes");
const CONFIG = require("./src/config");
const { database } = require("./src/database/index");
const app = express();

app.use(cors());
database.connect();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: true,
  message: "Too many requests, please try again after 15 minutes",
});
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/", (req, res) => {
  return res.json({ status: true });
});

app.use("/blog", blogRouter);
app.use("/auth", authRouter);
app.use(
  "/author/blog",
  passport.authenticate("jwt", { session: false }),
  authorRouter
);

// 404 error handler
app.use("*", (req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(err.status || 500).send("Oops, something failed");
});

module.exports = app;
