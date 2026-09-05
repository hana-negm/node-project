const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createCommentSchema, postCommentParamsSchema } = require("../validations/comment.validation");
const { addComment } = require("../controllers/comment.controller");

// Mounted by Member 5 as: app.use("/api/posts", require("./routes/comment.routes"))
// Gives: POST /api/posts/:postId/comments
router.post(
  "/:postId/comments",
  authMiddleware,
  validate(postCommentParamsSchema, "params"),
  validate(createCommentSchema),
  addComment
);

module.exports = router;
