const errorMiddleware = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong on the server.';
  res.status(status).json({ message });
};

module.exports = {
  errorMiddleware,
};
