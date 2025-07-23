import { loginUser } from '../services/auth.service.js';
export const login = async (req, res) => {
  const loginData = req.body;
  const accessToken = await authService.loginUser(loginData);

  res.status(200).json({
    accessToken,
  });
};
