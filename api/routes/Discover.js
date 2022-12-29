const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const asyncUtil = require("../middlewares/asyncUtil");

const getUsers = async (req, res) => {
  const count = await User.countDocuments().exec();
  const random = count >= 10 ? Math.floor(Math.random() * (count - 10)) : 0;
  const result = await User.find().limit(10).skip(random).exec();
  return res.status(200).json({
    code: 200,
    response: [...result],
  });
};

const getPosts = async (req, res) => {
  const count = await Post.countDocuments().exec();
  const random = count >= 10 ? Math.floor(Math.random() * (count - 10)) : 0;
  const result = await Post.find().limit(10).skip(random).populate("author").exec();
  return res.status(200).json({
    code: 200,
    response: [...result],
  });
};

router.get("/users", asyncUtil(getUsers));

router.get("/posts", asyncUtil(getPosts));

module.exports = router;
