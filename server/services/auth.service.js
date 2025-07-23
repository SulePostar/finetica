const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_ACCESS_TOKEN_DURATION_HOURS = '1h';

const loginUser = async (loginDto) => {
  const { email, password } = loginDto;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return null;
  }

  const secretKey = process.env.JWT_SECRET_KEY;

  const accessToken = jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    secretKey,
    { expiresIn: JWT_ACCESS_TOKEN_DURATION_HOURS }
  );

  return accessToken;
};

module.exports = {
  loginUser,
};
