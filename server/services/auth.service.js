const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpException } = require('../exceptions/HttpException');

const SALT_ROUNDS = 10;

const loginUser = async (loginDto) => {
  const { email, password } = loginDto;

  const user = await User.findOne({ where: { email }, include: 'role' });

  if (!user) {
    throw new HttpException(401, 'Bad credentials');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passHash);

  if (!isPasswordCorrect) {
    throw new HttpException(401, 'Bad credentials');
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

const registerUser = async (registerDto) => {
  const { name, email, password } = registerDto;
  const user = await User.findOne({ where: { email } });
  const defaultRole = await Role.findOne({ where: { name: 'user' } });
  console.log(defaultRole);
  if (user) {
    throw new HttpException(400, 'User with this email already exists');
  }
  return await User.create({ name, email, passHash: password, roleId: defaultRole.id });
};
module.exports = {
  loginUser,
  registerUser,
};
