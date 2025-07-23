const { loginUser } = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const loginData = req.body;
    const accessToken = await loginUser(loginData);

    if (!accessToken) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
};
