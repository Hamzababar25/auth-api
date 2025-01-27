import { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser, invalidateRefreshToken, isRefreshTokenValid } from '../services/authService';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user: { id: number };
}
export const register = async (req: Request, res: Response) => {
  const { email, password,role } = req.body;

  try {
    const user = await registerUser(email, password,role);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const { token, userId } = await loginUser(email, password);
//     res.status(200).json({ token, userId });
//   } catch (error: any) {
//     res.status(401).json({ error: error.message });
//   }
// };
import { generateTokens, storeRefreshToken } from '../services/authService';
import { jwtConfig } from '../config/jwtConfig';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { userId,role } = await loginUser(email, password);
    const { accessToken, refreshToken } = generateTokens(userId,role);

    await storeRefreshToken(userId, refreshToken);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
export const logout = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;

  try {
    await invalidateRefreshToken(userId);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
