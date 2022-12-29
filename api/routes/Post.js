const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { isAuth } = require("../middlewares/auth");
const asyncUtil = require("../middlewares/asyncUtil");
const AppError = require("../models/AppError");

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).exec();
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  return res.status(200).json({ code: 200, response: post });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOneAndDelete({
    _id: id,
    $or: [{ author: req.user._id }, { profile: req.user.username }],
  }).exec();
  return res.status(200).json({ code: 200, message: "Post deleted", deletedPost: post });
};

const likePost = async (req, res) => {
  const { id } = req.params;
  if (!req.user) {
    throw new AppError("Unauthorized Request", 403);
  }

  const query = {
    _id: id,
    likedBy: {
      $nin: req.user.username,
    },
  };

  const newValues = {
    $push: {
      likedBy: req.user.username,
    },
    $inc: {
      likes: 1,
    },
  };

  const likedPost = await Post.findOneAndUpdate(query, newValues, { new: true }).exec();
  if (!likedPost) {
    throw new AppError("You already liked this post", 403);
  }
  return res.status(200).json({ code: 200, response: likedPost });
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  if (!req.user) {
    throw new AppError("Unauthorized Request", 403);
  }

  const query = {
    _id: id,
    likedBy: {
      $in: req.user.username,
    },
  };

  const newValues = {
    $pull: {
      likedBy: req.user.username,
    },
    $inc: {
      likes: -1,
    },
  };

  const unlikedPost = await Post.findOneAndUpdate(query, newValues, { new: true }).exec();
  if (!unlikedPost) {
    throw new AppError("You haven't liked this post yet", 403);
  }
  return res.status(200).json({ code: 200, response: unlikedPost });
};

router.get("/:id", asyncUtil(getPost));
router.delete("/:id", isAuth, asyncUtil(deletePost));
router.post("/:id/like", isAuth, asyncUtil(likePost));
router.post("/:id/unlike", isAuth, asyncUtil(unlikePost));

module.exports = router;
