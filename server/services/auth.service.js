import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_DURATION_HOURS = '1h';

export const loginUser = async (loginDto) => {
  const { email, password } = loginDto;

  const user = User.findOne({ email });

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
    },
    secretKey,
    { expiresIn: JWT_ACCESS_TOKEN_DURATION_HOURS }
  );

  return accessToken;
};
