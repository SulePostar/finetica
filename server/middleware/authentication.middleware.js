const { HttpException } = require('../exceptions/HttpException');
const jwt = require('jsonwebtoken');

const authenticationMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log('Access Token:', accessToken);
  console.log(req.cookies);

  if (!accessToken) {
    throw new HttpException(401, 'Unauthorized');
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    console.log('Decoded Payload:', payload);
    req.user = {
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    throw new HttpException(401, 'Unauthorized');
  }
};

module.exports = {
  authenticationMiddleware,
};
