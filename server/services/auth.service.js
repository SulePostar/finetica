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
