import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';
import { generateTokens, isRefreshTokenValid, storeRefreshToken } from '../services/authService';

export const refreshTokens = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { refreshToken } = req.body;
  
      console.log("Received refresh token:", refreshToken);
  
      if (!refreshToken) {
        console.log("No refresh token provided.");
        return res.status(400).json({ error: 'Refresh token is required' });
      }
  
      let payload;
      try {
        payload = jwt.verify(refreshToken, jwtConfig.refreshSecret) as { userId: number,role:string };
        console.log("Decoded token payload:", payload);
      } catch (jwtError) {
        console.log("JWT verification failed:");
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }
  
      const isValid = await isRefreshTokenValid(refreshToken);
      console.log("Is refresh token valid?", isValid);
  
      if (!isValid) {
        console.log("Invalid refresh token.");
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      const { userId, role } = payload;
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId,role);
      console.log("Generated new accessToken:", accessToken);
      console.log("Generated new refreshToken:", newRefreshToken);
  
      await storeRefreshToken(payload.userId, newRefreshToken);
      console.log("Stored new refresh token in the database.");
  
      return res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error("Error in refreshTokens function:", error);
      next(error);
    }
  };
