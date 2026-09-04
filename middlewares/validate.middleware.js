const AppError = require("../utils/AppError");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new AppError(messages.join(", "), 400));
    }
    next();
  };
};

module.exports = validate;
