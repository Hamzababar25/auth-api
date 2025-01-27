import express from 'express';
import { register, login, logout, } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { refreshTokens } from '../controllers/refreshController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokens);
router.post('/logout', authenticate, logout);

export default router;
