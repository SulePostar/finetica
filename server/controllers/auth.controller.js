const { loginUser, registerUser } = require('../services/auth.service');

const ACCESS_COOKIE_EXPIRATION_MS = 60 * 60 * 1000;

const login = async (req, res, next) => {
  try {
    const loginData = req.body;
    const accessToken = await loginUser(loginData);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: ACCESS_COOKIE_EXPIRATION_MS,
      sameSite: 'Strict',
      path: '/',
    });
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const registerData = req.body;
    const newUser = await registerUser(registerData);
    res.status(201).json({ newUser, message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
};
