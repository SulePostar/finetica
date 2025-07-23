const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HttpException } = require('../exceptions/HttpException');

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

const registerUser = async (registerData) => {
  const { email, password } = registerData;

  try {
    if (typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const expectedDomain = 'symphony.is';

    const [localPart, domain] = email.split('@');

    if (domain !== expectedDomain) {
        return res.status(400).json({ error: `Email must be from @${expectedDomain}` });
    }

    const parts = localPart.split('.');

    if (parts.length !== 2) {
        return res.status(400).json({ error: 'Email local part must be in format name.surname' });
    }

    const [name, surname] = parts;

    const user = await User.create({
      roleId: roleId,
      name: name,
      email: email,
      passHash: password,
      profileImage: null,
      isEnabled: false,
      //ne treba staviti default vrijednosti za created i updated at.
    });


    return res.status(200).json({
      message: "User registered successfully!"
    })
  } catch(error) {
    return res.status(500).json({
      message: ``
    })
  }

}
module.exports = {
  loginUser,
  registerUser
};
