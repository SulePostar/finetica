const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (loginDto) => {
  const { email, password } = loginDto;

  const user = await User.findOne({ where: { email }, include: 'role' });

  if (!user) {
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passHash);

  if (!isPasswordCorrect) {
    return null;
  }

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role.name,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION_HOURS }
  );

  return accessToken;
};

module.exports = {
  loginUser,
};
