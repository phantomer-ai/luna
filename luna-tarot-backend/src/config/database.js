import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

// 환경 변수 디버깅
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? '설정됨' : '설정되지 않음');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase.co') ? { rejectUnauthorized: false } : false,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
});

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err);
});

// 데이터베이스 초기화 함수
export const initializeDatabase = async () => {
  try {
    // 테이블 생성
    await createTables();
    console.log('✅ 데이터베이스 테이블이 초기화되었습니다.');
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 오류:', error);
    throw error;
  }
};

// 테이블 생성 함수
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // users 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        birth_date DATE,
        zodiac_sign VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_premium BOOLEAN DEFAULT FALSE,
        premium_expires_at TIMESTAMP
      );
    `);

    // tarot_sessions 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS tarot_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        spread_type VARCHAR(20) NOT NULL,
        cards_drawn JSONB NOT NULL,
        luna_interpretation TEXT NOT NULL,
        user_feedback INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // tarot_cards 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS tarot_cards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        suit VARCHAR(20),
        number INTEGER,
        meaning_upright TEXT NOT NULL,
        meaning_reversed TEXT NOT NULL,
        keywords JSONB NOT NULL,
        description TEXT,
        image_url VARCHAR(255)
      );
    `);

    // user_memory 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_memory (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        memory_type VARCHAR(50) NOT NULL,
        memory_key VARCHAR(100) NOT NULL,
        memory_value TEXT NOT NULL,
        importance_score INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 인덱스 생성
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_tarot_sessions_user_id ON tarot_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_tarot_sessions_created_at ON tarot_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
    `);

  } finally {
    client.release();
  }
};

export default pool;
