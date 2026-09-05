const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
});

// For POST /api/posts/:postId/comments
const postCommentParamsSchema = Joi.object({
  postId: objectId.required(),
});

// For DELETE /api/comments/:id (top-level route, per the endpoint ownership table)
const commentIdParamsSchema = Joi.object({
  id: objectId.required(),
});

module.exports = {
  createCommentSchema,
  postCommentParamsSchema,
  commentIdParamsSchema,
};
