import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
     res.status(401).json({ error: "Unauthorized" });
     return
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret) as { userId: number };
    (req as AuthenticatedRequest).user = { id: payload.userId };

    next();
  } catch (err) {
     res.status(401).json({ error: "Invalid token" });
     return
  }
};

