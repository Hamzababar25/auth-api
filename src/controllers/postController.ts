import { Request, Response } from 'express';
import { createPostSchema, postIdSchema } from '../validations/postValidation';
import { createPost, getPosts, getPostById, deletePost, getAllPosts, } from '../services/postService';
import { PrismaClient } from '@prisma/client';
interface AuthenticatedRequest extends Request {
  user: { id: number,role:string };
}
const prisma = new PrismaClient();

export const handleCreatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return; 
    }
    const post = await prisma.post.create({
      data: { title, content, userId },
    });
    res.status(201).json(post); // Return the response correctly
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const handleGetPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const role = (req as AuthenticatedRequest).user.role;

    if (role === 'admin') {
      const posts = await prisma.post.findMany();
      res.json(posts);
      return;
    }

    const posts = await prisma.post.findMany({
      where: { userId },
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const handleGetAllPosts = async (req: Request, res: Response): Promise<void>  => {
  try {
  
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  }
}
};

export const handleGetPostById = async (req: Request, res: Response) : Promise<void>  => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
        if (!userId)
      {

       res.status(401).json({ error: "Unauthorized" });
       return
      }
    const { id } = postIdSchema.parse(req.params);
    const post = await getPostById(userId, Number(id));

    if (!post)
      { res.status(404).json({ error: "Post not found" });
    return
  }
    res.json(post);
  } catch (err) {
    if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  }
}
};

export const handleDeletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const role = (req as AuthenticatedRequest).user.role;
    const { id } = postIdSchema.parse(req.params);

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (role !== 'admin' && post.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: You cannot delete this post' });
      return;
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
