import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { jwtConfig } from '../config/jwtConfig';

const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role },
  });
  return user;
};


// export const loginUser = async (email: string, password: string) => {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) throw new Error('Invalid credentials');

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) throw new Error('Invalid credentials');

//   const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
//     expiresIn: jwtConfig.expiresIn,
//   });

//   return { token, userId: user.id };
// };
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const { accessToken, refreshToken } = generateTokens(user.id,user.role);

  // Store the refresh token in the database
  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, userId: user.id ,role:user.role };
};


export const generateTokens = (userId: number,role:string) => {
  const payload = { userId, role };
  const accessToken = jwt.sign(payload, jwtConfig.secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId: number, refreshToken: string) => {
 
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

 
  await prisma.refreshToken.create({
    data: { userId, token: refreshToken },
  });
};

export const invalidateRefreshToken = async (userId: number) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

export const isRefreshTokenValid = async (refreshToken: string): Promise<boolean> => {
  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  return !!token;
};
