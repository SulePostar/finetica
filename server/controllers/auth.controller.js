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

const register = async (req, res) => {
  const registerData = req.body;

  const success = await authService.registerUser(registerData);

  res.status(200).json({
    message: `Successfully registered user with email ${registerData.email} on role ${registerData.roleId} `,
  });
};

module.exports = {
  login,
  register,
};
