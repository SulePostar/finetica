const { loginUser } = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const loginData = req.body;
    const accessToken = await loginUser(loginData);
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
};
