function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
}

module.exports = errorHandler;
