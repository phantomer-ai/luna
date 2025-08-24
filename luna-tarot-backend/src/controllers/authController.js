import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../middleware/auth.js';
import { calculateZodiacSign } from '../config/openai.js';

// 회원가입
export const register = async (req, res) => {
  try {
    const { username, email, password, birthDate } = req.body;
    
    // 이메일 중복 확인
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: '이미 사용 중인 이메일입니다.'
      });
    }
    
    // 사용자명 중복 확인
    const usernameCheck = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: '이미 사용 중인 사용자명입니다.'
      });
    }
    
    // 비밀번호 해싱
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // 별자리 계산
    const zodiacSign = calculateZodiacSign(birthDate);
    
    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, birth_date, zodiac_sign) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, birth_date, zodiac_sign, is_premium, created_at',
      [username, email, passwordHash, birthDate, zodiacSign]
    );
    
    const user = result.rows[0];
    const token = generateToken(user.id);
    
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          birthDate: user.birth_date,
          zodiacSign: user.zodiac_sign,
          isPremium: user.is_premium,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      success: false,
      error: '회원가입 중 오류가 발생했습니다.'
    });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 사용자 조회
    const result = await pool.query(
      'SELECT id, username, email, password_hash, birth_date, zodiac_sign, is_premium, premium_expires_at, created_at FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }
    
    const user = result.rows[0];
    
    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
      });
    }
    
    // JWT 토큰 생성
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: '로그인이 완료되었습니다.',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          birthDate: user.birth_date,
          zodiacSign: user.zodiac_sign,
          isPremium: user.is_premium,
          premiumExpiresAt: user.premium_expires_at,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      success: false,
      error: '로그인 중 오류가 발생했습니다.'
    });
  }
};

// 프로필 조회
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT id, username, email, birth_date, zodiac_sign, is_premium, premium_expires_at, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      });
    }
    
    const user = result.rows[0];
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          birthDate: user.birth_date,
          zodiacSign: user.zodiac_sign,
          isPremium: user.is_premium,
          premiumExpiresAt: user.premium_expires_at,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '프로필 조회 중 오류가 발생했습니다.'
    });
  }
};

// 프로필 업데이트
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, birthDate } = req.body;
    
    // 업데이트할 필드들 준비
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;
    
    if (username) {
      // 사용자명 중복 확인
      const usernameCheck = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      
      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: '이미 사용 중인 사용자명입니다.'
        });
      }
      
      updateFields.push(`username = $${paramCount++}`);
      updateValues.push(username);
    }
    
    if (email) {
      // 이메일 중복 확인
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: '이미 사용 중인 이메일입니다.'
        });
      }
      
      updateFields.push(`email = $${paramCount++}`);
      updateValues.push(email);
    }
    
    if (birthDate) {
      updateFields.push(`birth_date = $${paramCount++}`);
      updateValues.push(birthDate);
      
      // 별자리 재계산
      const zodiacSign = calculateZodiacSign(birthDate);
      updateFields.push(`zodiac_sign = $${paramCount++}`);
      updateValues.push(zodiacSign);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: '업데이트할 내용이 없습니다.'
      });
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(userId);
    
    // 프로필 업데이트
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, username, email, birth_date, zodiac_sign, is_premium, premium_expires_at, created_at, updated_at
    `;
    
    const result = await pool.query(query, updateValues);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      });
    }
    
    const user = result.rows[0];
    
    res.json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          birthDate: user.birth_date,
          zodiacSign: user.zodiac_sign,
          isPremium: user.is_premium,
          premiumExpiresAt: user.premium_expires_at,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      error: '프로필 업데이트 중 오류가 발생했습니다.'
    });
  }
};

// 이메일 중복 확인
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    res.json({
      success: true,
      data: {
        available: result.rows.length === 0
      }
    });
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    res.status(500).json({
      success: false,
      error: '이메일 중복 확인 중 오류가 발생했습니다.'
    });
  }
};

// 사용자명 중복 확인
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    
    res.json({
      success: true,
      data: {
        available: result.rows.length === 0
      }
    });
  } catch (error) {
    console.error('사용자명 중복 확인 오류:', error);
    res.status(500).json({
      success: false,
      error: '사용자명 중복 확인 중 오류가 발생했습니다.'
    });
  }
};
