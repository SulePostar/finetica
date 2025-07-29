const AppError = require('../utils/errorHandler');

const validate = (schema) => (req, res, next) => {
  const options = {
    abortEarly: false,
    stripUnknown: true,
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');

    throw new AppError(`Validation error: ${errorMessage}`, 400);
  }

  req.body = value;

  return next();
};

module.exports = validate;
