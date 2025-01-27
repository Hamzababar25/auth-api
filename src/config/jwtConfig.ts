import dotenv from 'dotenv';
dotenv.config();
export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'default_fallback_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    expiresIn: '1h',
  };
  