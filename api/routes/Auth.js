const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/User");
const asyncUtil = require("../middlewares/asyncUtil");
const AppError = require("../models/AppError");
const router = express.Router();

const signup = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError("You must provide all the information", 400);
  }

  const user = await User.findOne({ username }).exec();

  if (user) {
    throw new AppError("User already registered", 403);
  }

  const hashPassword = await bcrypt.hash(password, 5);
  let newUser = await new User({ username, password: hashPassword }).save();

  newUser = newUser.toObject();
  delete newUser["password"];

  const token = jwt.sign(
    {
      data: newUser,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    SECRET_KEY
  );

  return res.status(200).json({
    code: 200,
    response: {
      token,
      ...newUser,
    },
  });
};

const signin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ code: 400, message: "You must provide all the information" });
    throw new AppError("You must provide all the information", 400);
  }

  const user = await User.findOne({ username }).select("+password").lean().exec();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const successLogged = await bcrypt.compare(password, user.password);
  if (!successLogged) {
    throw new AppError("Invalid Password", 403);
  }

  const token = jwt.sign(
    {
      data: user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    SECRET_KEY
  );
  delete user["password"];

  return res.status(200).json({
    code: 200,
    response: {
      token,
      ...user,
    },
  });
};

router.post("/sign-up", asyncUtil(signup));

router.post("/sign-in", asyncUtil(signin));

module.exports = router;
