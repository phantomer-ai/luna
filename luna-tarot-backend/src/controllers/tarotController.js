import { drawCards, SPREAD_TYPES } from '../utils/cardDeck.js';
import { getLunaResponse, getUserContext, updateUserMemory, checkDailyUsage, incrementDailyUsage } from '../services/openaiService.js';
import { redisUtils } from '../config/redis.js';
import pool from '../config/database.js';

// 타로 상담 요청
export const getTarotReading = async (req, res) => {
  try {
    const { question, spreadType = 'one_card' } = req.body;
    const userId = req.user.id;

    // 사용자 정보 조회
    const userResult = await pool.query(
      'SELECT zodiac_sign, is_premium FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // 프리미엄 사용자가 아닌 경우 일일 제한 체크
    if (!user.is_premium) {
      const dailyUsage = await checkDailyUsage(userId, redisUtils);
      if (dailyUsage >= 1) {
        return res.status(403).json({
          success: false,
          error: '일일 무료 상담 횟수를 초과했습니다. 프리미엄으로 업그레이드해보세요!'
        });
      }
    }

    // 스프레드 타입에 따른 카드 개수 결정
    const spread = SPREAD_TYPES[spreadType];
    if (!spread) {
      return res.status(400).json({
        success: false,
        error: '올바르지 않은 스프레드 타입입니다.'
      });
    }

    // 카드 뽑기
    const drawnCards = drawCards(spread.cardCount);

    // 사용자 컨텍스트 준비
    const userContext = await getUserContext(userId);

    // 루나의 해석 받기
    const lunaInterpretation = await getLunaResponse(
      drawnCards, 
      question, 
      userContext
    );

    // 상담 세션 저장
    const sessionResult = await pool.query(
      'INSERT INTO tarot_sessions (user_id, question, spread_type, cards_drawn, luna_interpretation) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, question, spreadType, JSON.stringify(drawnCards), lunaInterpretation]
    );

    // 사용자 메모리 업데이트
    await updateUserMemory(userId, question, drawnCards);

    // 일일 사용량 증가 (무료 사용자만)
    if (!user.is_premium) {
      await incrementDailyUsage(userId, redisUtils);
    }

    res.json({
      success: true,
      message: '타로 상담이 완료되었습니다.',
      data: {
        sessionId: sessionResult.rows[0].id,
        cards: drawnCards,
        interpretation: lunaInterpretation,
        spreadType: spreadType,
        spreadInfo: spread,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('타로 상담 오류:', error);
    res.status(500).json({
      success: false,
      error: '루나와의 연결에 문제가 생겼어요. 잠시 후 다시 시도해주세요.'
    });
  }
};

// 상담 기록 조회
export const getTarotHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 상담 기록 조회
    const result = await pool.query(
      `SELECT id, question, spread_type, cards_drawn, luna_interpretation, user_feedback, created_at
       FROM tarot_sessions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // 전체 개수 조회
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM tarot_sessions WHERE user_id = $1',
      [userId]
    );

    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        sessions: result.rows.map(session => ({
          id: session.id,
          question: session.question,
          spreadType: session.spread_type,
          cards: session.cards_drawn,
          interpretation: session.luna_interpretation,
          feedback: session.user_feedback,
          createdAt: session.created_at
        })),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('상담 기록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '상담 기록을 불러오는데 실패했습니다.'
    });
  }
};

// 상담 세션 상세 조회
export const getTarotSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = parseInt(req.params.sessionId);

    const result = await pool.query(
      `SELECT id, question, spread_type, cards_drawn, luna_interpretation, user_feedback, created_at
       FROM tarot_sessions 
       WHERE id = $1 AND user_id = $2`,
      [sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '상담 세션을 찾을 수 없습니다.'
      });
    }

    const session = result.rows[0];

    res.json({
      success: true,
      data: {
        id: session.id,
        question: session.question,
        spreadType: session.spread_type,
        cards: session.cards_drawn,
        interpretation: session.luna_interpretation,
        feedback: session.user_feedback,
        createdAt: session.created_at
      }
    });

  } catch (error) {
    console.error('상담 세션 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '상담 세션을 불러오는데 실패했습니다.'
    });
  }
};

// 상담 피드백 제출
export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId, rating, comment } = req.body;

    // 세션 존재 확인 및 소유권 확인
    const sessionResult = await pool.query(
      'SELECT id FROM tarot_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '상담 세션을 찾을 수 없습니다.'
      });
    }

    // 피드백 업데이트
    await pool.query(
      'UPDATE tarot_sessions SET user_feedback = $1 WHERE id = $2',
      [rating, sessionId]
    );

    res.json({
      success: true,
      message: '피드백이 제출되었습니다.'
    });

  } catch (error) {
    console.error('피드백 제출 오류:', error);
    res.status(500).json({
      success: false,
      error: '피드백 제출에 실패했습니다.'
    });
  }
};

// 일일 사용량 조회
export const getDailyUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    // 사용자 정보 조회
    const userResult = await pool.query(
      'SELECT is_premium FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    if (user.is_premium) {
      return res.json({
        success: true,
        data: {
          isPremium: true,
          dailyUsage: 0,
          dailyLimit: -1, // 무제한
          remaining: -1
        }
      });
    }

    // 일일 사용량 조회
    const dailyUsage = await checkDailyUsage(userId, redisUtils);
    const dailyLimit = 1; // 무료 사용자 일일 1회
    const remaining = Math.max(0, dailyLimit - dailyUsage);

    res.json({
      success: true,
      data: {
        isPremium: false,
        dailyUsage,
        dailyLimit,
        remaining
      }
    });

  } catch (error) {
    console.error('일일 사용량 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '사용량 정보를 불러오는데 실패했습니다.'
    });
  }
};

// 스프레드 타입 목록 조회
export const getSpreadTypes = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        spreadTypes: SPREAD_TYPES
      }
    });
  } catch (error) {
    console.error('스프레드 타입 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '스프레드 타입을 불러오는데 실패했습니다.'
    });
  }
};
