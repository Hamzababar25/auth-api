import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

interface AuthenticatedRequest extends Request {
  user?: { id: number,role:string };
}
// export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//      res.status(401).json({ error: "Unauthorized" });
//      return
//   }

//   try {
//     const payload = jwt.verify(token, jwtConfig.secret) as { userId: number };
//     (req as AuthenticatedRequest).user = { id: payload.userId };

//     next();
//   } catch (err) {
//      res.status(401).json({ error: "Invalid token" });
//      return
//   }
// };

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtConfig.secret) as { userId: number; role: string };
    (req as AuthenticatedRequest).user = { id: payload.userId, role: payload.role };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
