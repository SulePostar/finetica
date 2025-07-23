import { loginUser } from '../services/auth.service.js';
export const login = async (req, res) => {
  const loginData = req.body;
  const accessToken = await authService.loginUser(loginData);

  res.status(200).json({
    accessToken,
  });
};

export const register = async (req, res) => {
  const registerData = req.body;

  const success = await authService.registerUser(registerData);

  res.status(200).json({
    message: `Successfully registered user with email ${registerData.email}`
  });
}
