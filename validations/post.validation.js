const Joi = require("joi");

const createPostSchema = Joi.object({
  title: Joi.string().min(5).required(),
  content: Joi.string().min(10).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(5).optional(),
  content: Joi.string().min(10).optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional(),
}).min(1);

module.exports = { createPostSchema, updatePostSchema };
