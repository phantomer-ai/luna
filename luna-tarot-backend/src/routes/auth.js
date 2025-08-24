import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  checkEmail, 
  checkUsername 
} from '../controllers/authController.js';
import { 
  authenticateToken, 
  refreshToken 
} from '../middleware/auth.js';
import { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate, 
  validateEmailCheck, 
  validateUsernameCheck 
} from '../middleware/validation.js';

const router = express.Router();

// 회원가입
router.post('/register', validateRegister, register);

// 로그인
router.post('/login', validateLogin, login);

// 토큰 갱신
router.post('/refresh', refreshToken);

// 이메일 중복 확인
router.post('/check-email', validateEmailCheck, checkEmail);

// 사용자명 중복 확인
router.post('/check-username', validateUsernameCheck, checkUsername);

// 프로필 조회 (인증 필요)
router.get('/profile', authenticateToken, getProfile);

// 프로필 업데이트 (인증 필요)
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);

export default router;
