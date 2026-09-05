const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createCommentSchema,
  commentParamsSchema,
  postCommentParamsSchema,
} = require("../validations/comment.validation");
const {
  addComment,
  deleteComment,
} = require("../controllers/comment.controller");

router.post(
  "/:postId/comments",
  authMiddleware,
  validate(postCommentParamsSchema, "params"),
  validate(createCommentSchema),
  addComment
);

router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  validate(commentParamsSchema, "params"),
  deleteComment
);

module.exports = router;
