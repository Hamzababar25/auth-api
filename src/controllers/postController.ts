import { Request, Response } from 'express';
import { createPostSchema, postIdSchema } from '../validations/postValidation';
import { createPost, getPosts, getPostById, deletePost, getAllPosts, } from '../services/postService';
import { PrismaClient } from '@prisma/client';
interface AuthenticatedRequest extends Request {
  user: { id: number };
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


export const handleGetPosts = async (req: Request, res: Response): Promise<void>  => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    if (!userId)
      {  res.status(401).json({ error: "Unauthorized" });
    return
  }
    const posts = await getPosts(userId);
    res.json(posts);
  } catch (err) {
    if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  }
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

export const handleDeletePost = async (req: Request, res: Response): Promise<void>  => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
        if (!userId){res.status(401).json({ error: "Unauthorized" });
  return}
    const { id } = postIdSchema.parse(req.params);
    const deleted = await deletePost(userId, Number(id));

    if (!deleted.count){ res.status(404).json({ error: "Post not found" });
  return}
    res.status(204).send();
  } catch (err) {
    if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  }
}
};
