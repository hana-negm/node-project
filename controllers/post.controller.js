const Post = require("../models/Post.model");
const AppError = require("../utils/AppError");
const asyncWrapper = require("../utils/asyncWrapper");

const createPost = asyncWrapper(async (req, res) => {
  const { title, content, category, tags, isPublished } = req.body;

  const post = await Post.create({
    title,
    content,
    author: req.user.id,
    category,
    tags,
    isPublished,
    coverImage: req.file ? req.file.path : undefined,
  });

  res.status(201).json({ status: "success", data: { post } });
});

const getAllPosts = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10, search, category, author, sort } = req.query;

  const query = { isPublished: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (author) {
    query.author = author;
  }

  let sortOption = { createdAt: -1 };
  if (sort) {
    const field = sort.startsWith("-") ? sort.slice(1) : sort;
    const order = sort.startsWith("-") ? -1 : 1;
    sortOption = { [field]: order };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate("author", "name email avatar")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(query),
  ]);

  res.status(200).json({
    status: "success",
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)),
    data: { posts },
  });
});

const getPostById = asyncWrapper(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email avatar")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name avatar" },
    });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  res.status(200).json({ status: "success", data: { post } });
});

const updatePost = asyncWrapper(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    throw new AppError("You are not authorized to update this post", 403);
  }

  const { title, content, category, tags, isPublished } = req.body;

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (category !== undefined) post.category = category;
  if (tags !== undefined) post.tags = tags;
  if (isPublished !== undefined) post.isPublished = isPublished;
  if (req.file) post.coverImage = req.file.path;

  await post.save();

  const updatedPost = await Post.findById(post._id)
    .populate("author", "name email avatar");

  res.status(200).json({ status: "success", data: { post: updatedPost } });
});

const deletePost = asyncWrapper(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    throw new AppError("You are not authorized to delete this post", 403);
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({ status: "success", message: "Post deleted" });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
