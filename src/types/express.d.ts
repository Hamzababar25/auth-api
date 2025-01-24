import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number }; // Add the `user` property
    }
  }
}
