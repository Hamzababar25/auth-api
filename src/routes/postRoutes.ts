import express from 'express';
import {
  handleCreatePost,
  handleGetPosts,
  handleGetPostById,
  handleDeletePost,
  handleGetAllPosts,
} from '../controllers/postController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, handleCreatePost);
router.get('/',authenticate, handleGetPosts);
router.get('/all', handleGetAllPosts);

router.get('/:id', authenticate, handleGetPostById);
router.delete('/:id', authenticate, handleDeletePost);

export default router;
