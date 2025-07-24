const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpException } = require('../exceptions/HttpException');

const JWT_ACCESS_TOKEN_DURATION_H = '1h';

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
    { expiresIn: JWT_ACCESS_TOKEN_DURATION_H }
  );

  return accessToken;
};

const registerUser = async (registerData) => {
  const { name, email, password } = registerData;
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new HttpException(400, 'User with this email already exists');
  }
  const defaultRole = await Role.findOne({ where: { name: 'guest' } });
  return await User.create({
    name,
    email,
    passHash: password,
    roleId: defaultRole.id,
  });
};
module.exports = {
  loginUser,
  registerUser,
};
