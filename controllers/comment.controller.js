const mongoose = require("mongoose");
const Comment = require("../models/Comment.model");
const Post = require("../models/Post.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

// POST /api/posts/:postId/comments
const addComment = asyncWrapper(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comment = await Comment.create({
    text,
    user: req.user.id,
    post: post._id,
  });

  await comment.populate("user", "name avatar");

  res.status(201).json({
    status: "success",
    data: { comment },
  });
});

// DELETE /api/comments/:id  (top-level route, per the endpoint ownership table)
const deleteComment = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const isOwner = comment.user.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not authorized to delete this comment", 403);
  }

  await comment.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Comment deleted",
  });
});

module.exports = {
  addComment,
  deleteComment,
};
