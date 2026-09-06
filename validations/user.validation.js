const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .trim(),

  email: Joi.string()
    .email()
    .lowercase(),

}).min(1);

const userIdSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required(),
});

module.exports = {
  updateUserSchema,
  userIdSchema,
};