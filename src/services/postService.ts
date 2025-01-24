import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (userId: number, title: string, content: string) => {
  return prisma.post.create({
    data: {
      title,
      content,
      userId,
    },
  });
};

export const getPosts = async (userId: number) => {
  return prisma.post.findMany({
    where: { userId },
  });
};
export const getAllPosts = async () => {
  return prisma.post.findMany();
};
export const getPostById = async (userId: number, id: number) => {
  return prisma.post.findFirst({
    where: { id, userId },
  });
};

export const deletePost = async (userId: number, id: number) => {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
};
