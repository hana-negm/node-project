const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createCommentSchema = Joi.object({
  text: Joi.string().trim().min(1).max(1000).required(),
});

const commentParamsSchema = Joi.object({
  postId: objectId.required(),
  commentId: objectId.required(),
});

const postCommentParamsSchema = Joi.object({
  postId: objectId.required(),
});

module.exports = {
  createCommentSchema,
  commentParamsSchema,
  postCommentParamsSchema,
};
