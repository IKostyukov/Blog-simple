const express = require("express");
const passport = require("../authentication/passport");
const { userValidator } = require("../validators/index");
const { authController } = require("../controllers");
const authRouter = express.Router();

authRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  userValidator,
  authController.signup
);

authRouter.post("/login", async (req, res, next) =>
  passport.authenticate("login", (err, user, info) => {
    authController.login(req, res, { err, user, info });
  })(req, res, next)
);

module.exports = authRouter;
