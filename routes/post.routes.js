const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");
const validate = require("../middlewares/validate.middleware");
const { createPostSchema, updatePostSchema } = require("../validations/post.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router
  .route("/")
  .get(getAllPosts)
  .post(authMiddleware, upload.single("coverImage"), validate(createPostSchema), createPost);

router
  .route("/:id")
  .get(getPostById)
  .put(authMiddleware, upload.single("coverImage"), validate(updatePostSchema), updatePost)
  .delete(authMiddleware, deletePost);

module.exports = router;
