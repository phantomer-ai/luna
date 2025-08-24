import express from 'express';
import { getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateProfileUpdate } from '../middleware/validation.js';

const router = express.Router();

// 모든 사용자 라우트에 인증 필요
router.use(authenticateToken);

// 프로필 조회
router.get('/profile', getProfile);

// 프로필 업데이트
router.put('/profile', validateProfileUpdate, updateProfile);

export default router;
