import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// JWT 토큰 검증 미들웨어
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: '액세스 토큰이 필요합니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 정보 조회
    const result = await pool.query(
      'SELECT id, username, email, is_premium, premium_expires_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: '유효하지 않은 토큰입니다.' 
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: '유효하지 않은 토큰입니다.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: '토큰이 만료되었습니다.' 
      });
    }
    
    console.error('인증 미들웨어 오류:', error);
    return res.status(500).json({ 
      success: false, 
      error: '인증 처리 중 오류가 발생했습니다.' 
    });
  }
};

// 선택적 인증 미들웨어 (토큰이 있으면 사용자 정보 추가, 없어도 통과)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const result = await pool.query(
        'SELECT id, username, email, is_premium, premium_expires_at FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // 토큰 오류가 있어도 계속 진행
    next();
  }
};

// 프리미엄 사용자 확인 미들웨어
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: '로그인이 필요합니다.' 
    });
  }

  if (!req.user.is_premium) {
    return res.status(403).json({ 
      success: false, 
      error: '프리미엄 서비스입니다. 업그레이드가 필요합니다.' 
    });
  }

  // 프리미엄 만료 확인
  if (req.user.premium_expires_at && new Date() > new Date(req.user.premium_expires_at)) {
    return res.status(403).json({ 
      success: false, 
      error: '프리미엄 구독이 만료되었습니다.' 
    });
  }

  next();
};

// JWT 토큰 생성 함수
export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );
};

// JWT 토큰 갱신 함수
export const refreshToken = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: '토큰이 필요합니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = generateToken(decoded.userId);

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: '토큰 갱신에 실패했습니다.' 
    });
  }
};
