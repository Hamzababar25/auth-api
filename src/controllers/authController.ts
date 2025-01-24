import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token, userId } = await loginUser(email, password);
    res.status(200).json({ token, userId });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
