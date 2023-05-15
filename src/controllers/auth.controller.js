const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

exports.signup = (req, res, next) => {
  const { firstname, lastname, email } = req.body;
  try {
    const user = new UserModel({
      firstname: firstname,
      lastname: lastname,
      email: email,
    });

    return res.status(201).json({
      message: "Signup successful",
      user: user,
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = (req, res, { err, user, info }) => {
  if (!user) {
    return res.status(400).json({ message: "email or password is incorrect" });
  }

  req.login(user, { session: false }, async (error) => {
    if (error) {
      return res.json({ message: error });
    }
    const body = { _id: user._id, email: user.email };
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  });
};
