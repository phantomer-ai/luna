import express from 'express';
import { 
  getTarotReading, 
  getTarotHistory, 
  getTarotSession, 
  submitFeedback, 
  getDailyUsage, 
  getSpreadTypes 
} from '../controllers/tarotController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateTarotReading, validateFeedback } from '../middleware/validation.js';

const router = express.Router();

// 모든 타로 라우트에 인증 필요
router.use(authenticateToken);

// 타로 상담 요청
router.post('/reading', validateTarotReading, getTarotReading);

// 상담 기록 조회
router.get('/history', getTarotHistory);

// 상담 세션 상세 조회
router.get('/session/:sessionId', getTarotSession);

// 상담 피드백 제출
router.post('/feedback', validateFeedback, submitFeedback);

// 일일 사용량 조회
router.get('/daily-usage', getDailyUsage);

// 스프레드 타입 목록 조회
router.get('/spread-types', getSpreadTypes);

export default router;
