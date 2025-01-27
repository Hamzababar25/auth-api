import express from 'express';
import {
  handleCreatePost,
  handleGetPosts,
  handleGetPostById,
  handleDeletePost,
  handleGetAllPosts,
} from '../controllers/postController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/', authenticate, authorize(['user', 'admin']), handleCreatePost);
router.get('/', authenticate, authorize(['user', 'admin']), handleGetPosts);

// Admin-Only Permissions
router.get('/all', authenticate, authorize(['admin']), handleGetAllPosts);
router.delete('/:id', authenticate, authorize(['admin']), handleDeletePost);

// User-Specific Permissions
router.get('/:id', authenticate, authorize(['user', 'admin']), handleGetPostById);


export default router;
