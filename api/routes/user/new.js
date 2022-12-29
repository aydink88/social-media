const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const { isAuth } = require("../../middlewares/auth");
const asyncUtil = require("../../middlewares/asyncUtil");

const createPost = async (req, res) => {
  const { username: profile } = req.params;
  let { message, extra = null } = req.body;
  const { _id: author } = req.user;

  if (extra.value && extra.extraType) {
    extra.value = extra.value.split("=")[1];
  } else {
    extra = null;
  }

  const newPost = await new Post({ author, profile, message, extra }).save();
  const populatedPost = await Post.populate(newPost, { path: "author" });
  res.status(200).json({
    code: 200,
    response: populatedPost,
  });
};

router.post("/new/post/:username", isAuth, asyncUtil(createPost));

module.exports = router;
