const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const passport = require("passport");
const { blogRouter, authRouter, authorRouter } = require("./src/routes");
const { database } = require("./src/database/index");

const CONFIG = require("./src/config");
const app = express();

app.use(cors());
database.connect(CONFIG.MONGODB_CONNECTION_URL);

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
    limits: {
      fileSize: 3000000, // Around 10MB
    },
    abortOnLimit: true,
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
  if (err.status != 500) {
    res.status(err.status || 400).send(err.message);
  }
  res.status(err.status || 500).send("Oops, something failed");
});

module.exports = app;
