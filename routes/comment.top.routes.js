const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { commentIdParamsSchema } = require("../validations/comment.validation");
const { deleteComment } = require("../controllers/comment.controller");

// Mounted by Member 5 as: app.use("/api/comments", require("./routes/comment.top.routes"))
// Gives: DELETE /api/comments/:id — matches the spec's endpoint ownership table exactly.
router.delete(
  "/:id",
  authMiddleware,
  validate(commentIdParamsSchema, "params"),
  deleteComment
);

module.exports = router;
