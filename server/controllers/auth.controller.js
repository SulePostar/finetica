const { loginUser, registerUser } = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const loginData = req.body;
    const accessToken = await loginUser(loginData);
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const registerData = req.body;
    const newUser = await registerUser(registerData);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
};
