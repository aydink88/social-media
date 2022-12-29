const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Post = require("../../models/Post");
const { isAuth } = require("../../middlewares/auth");
const AppError = require("../../models/AppError");
const asyncUtil = require("../../middlewares/asyncUtil");

const getUser = async (req, res) => {
  let { username } = req.params;

  const user = await User.findOne({ username }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const [posts, likes] = await Promise.all([
    Post.countDocuments({ profile: username }),
    Post.countDocuments({ likedBy: { $in: username } }),
  ]);
  return res.status(200).send({
    code: 200,
    response: {
      posts,
      likes,
      ...user.toObject(),
    },
  });
};

const getPostsByUser = async (req, res) => {
  const { username: profile } = req.params;
  const { offset = 0, quantity = 20 } = req.query;

  const posts = await Post.find({ profile })
    .skip(parseInt(offset))
    .limit(parseInt(quantity))
    .sort("-createdAt")
    .populate("author")
    .exec();

  return res.status(200).json({
    code: 200,
    response: posts,
  });
};

const getLikesByUsername = async (req, res) => {
  // Search by id to be implemented
  const { username } = req.params;
  const posts = await Post.find({ likedBy: { $in: username } })
    .limit(2)
    .exec();
  res.send(posts);
};

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

router.get("/:username", asyncUtil(getUser));
router.get("/:username/posts", asyncUtil(getPostsByUser));
router.get("/:id/likes", asyncUtil(getLikesByUsername));
router.post("/:username/new/post", isAuth, asyncUtil(createPost));

module.exports = router;
