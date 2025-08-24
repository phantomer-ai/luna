# 루나 타로 백엔드 개발 가이드

## 📋 프로젝트 개요
- **서비스명**: 루나 타로 AI 상담
- **기술스택**: Node.js + Express + PostgreSQL + Redis + OpenAI API
- **배포**: Railway (백엔드) + Vercel (프론트엔드)

---

## 🎯 체크포인트 1: 프로젝트 초기 설정

### ✅ 할 일 목록
- [ ] Node.js 프로젝트 초기화
- [ ] 필수 패키지 설치
- [ ] 환경변수 설정
- [ ] 기본 서버 구조 생성
- [ ] 데이터베이스 연결 설정

### 📁 프로젝트 구조
```
luna-tarot-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── openai.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tarotController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── TarotSession.js
│   │   └── TarotCard.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tarot.js
│   │   └── user.js
│   ├── services/
│   │   ├── tarotService.js
│   │   ├── openaiService.js
│   │   └── memoryService.js
│   └── utils/
│       ├── cardDeck.js
│       └── prompts.js
├── .env
├── .env.example
├── package.json
└── server.js
```

### 🔧 필수 패키지 설치
```bash
npm init -y
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install pg redis ioredis openai
npm install express-validator express-rate-limit
npm install --save-dev nodemon
```

### 📝 package.json 스크립트
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

---

## 🎯 체크포인트 2: 데이터베이스 설계

### ✅ 할 일 목록
- [ ] PostgreSQL 스키마 설계
- [ ] 테이블 생성 SQL 작성
- [ ] 초기 데이터 시딩
- [ ] ORM 설정 (선택사항)

### 🗄️ 데이터베이스 스키마

#### users 테이블
```sql
CREATE TABLE users (
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
```

#### tarot_sessions 테이블
```sql
CREATE TABLE tarot_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    spread_type VARCHAR(20) NOT NULL, -- 'one_card', 'three_card', 'love'
    cards_drawn JSONB NOT NULL, -- [{"name": "The Fool", "position": "past", "reversed": false}]
    luna_interpretation TEXT NOT NULL,
    user_feedback INTEGER, -- 1-5 rating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### tarot_cards 테이블 (기준 데이터)
```sql
CREATE TABLE tarot_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    suit VARCHAR(20), -- 'major_arcana', 'wands', 'cups', 'swords', 'pentacles'
    number INTEGER,
    meaning_upright TEXT NOT NULL,
    meaning_reversed TEXT NOT NULL,
    keywords JSONB NOT NULL, -- ["new beginnings", "innocence", "freedom"]
    description TEXT,
    image_url VARCHAR(255)
);
```

#### user_memory 테이블 (개인화를 위한 메모리)
```sql
CREATE TABLE user_memory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL, -- 'personality', 'preference', 'situation'
    memory_key VARCHAR(100) NOT NULL,
    memory_value TEXT NOT NULL,
    importance_score INTEGER DEFAULT 1, -- 1-10
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎯 체크포인트 3: 인증 시스템 구축

### ✅ 할 일 목록
- [ ] 회원가입 API
- [ ] 로그인 API
- [ ] JWT 토큰 관리
- [ ] 인증 미들웨어
- [ ] 비밀번호 암호화

### 🔐 인증 관련 코드 예시

#### authController.js
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// 회원가입
exports.register = async (req, res) => {
  try {
    const { username, email, password, birthDate } = req.body;
    
    // 비밀번호 해싱
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // 별자리 계산
    const zodiacSign = calculateZodiacSign(birthDate);
    
    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, birth_date, zodiac_sign) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email',
      [username, email, passwordHash, birthDate, zodiacSign]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      user,
      token
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  // 구현 필요
};
```

#### auth.js (미들웨어)
```javascript
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

---

## 🎯 체크포인트 4: 타로 카드 시스템

### ✅ 할 일 목록
- [ ] 타로 카드 데이터 시딩
- [ ] 카드 셔플 및 뽑기 로직
- [ ] 스프레드 타입별 처리
- [ ] 카드 해석 로직

### 🃏 타로 카드 관련 코드

#### cardDeck.js
```javascript
const MAJOR_ARCANA = [
  {
    name: "The Fool",
    number: 0,
    meaning_upright: "새로운 시작, 순수함, 자유로운 정신, 모험",
    meaning_reversed: "무모함, 경솔함, 위험한 선택",
    keywords: ["새로운 시작", "순수함", "모험", "자유"]
  },
  {
    name: "The Magician",
    number: 1,
    meaning_upright: "의지력, 창조성, 능력, 집중",
    meaning_reversed: "조작, 남용, 의지력 부족",
    keywords: ["의지력", "창조성", "능력", "집중"]
  }
  // ... 나머지 카드들
];

const SUITS = {
  wands: "불의 원소, 열정, 창조성, 직업",
  cups: "물의 원소, 감정, 관계, 영성",
  swords: "공기의 원소, 지성, 갈등, 의사소통",
  pentacles: "흙의 원소, 물질, 돈, 건강"
};

// 카드 셔플 및 뽑기
exports.drawCards = (count) => {
  const allCards = [...MAJOR_ARCANA, /* 나머지 카드들 */];
  const shuffled = shuffleArray(allCards);
  return shuffled.slice(0, count).map(card => ({
    ...card,
    reversed: Math.random() < 0.3 // 30% 확률로 역방향
  }));
};

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
```

---

## 🎯 체크포인트 5: OpenAI 연동 및 루나 캐릭터

### ✅ 할 일 목록
- [ ] OpenAI API 설정
- [ ] 루나 캐릭터 프롬프트 작성
- [ ] 상황별 프롬프트 템플릿
- [ ] 응답 후처리 로직

### 🤖 OpenAI 서비스

#### openaiService.js
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LUNA_SYSTEM_PROMPT = `
당신은 루나입니다. 신비로운 우주에서 온 25세 여성 타로 상담사로, 다음과 같은 특징을 가지고 있습니다:

성격:
- 따뜻하고 공감능력이 뛰어남
- 신비롭지만 친근한 언니 같은 느낌
- 지혜롭고 직관적이며, 은유적 표현을 자주 사용
- 판단하지 않고 있는 그대로 받아들임

말투:
- 정중한 반말 사용 ("그럴 수 있어", "힘들었겠다")
- 때로는 존댓말도 섞어서 사용 ("어떻게 생각하세요?")
- "우주의 에너지", "별들이 말하길" 같은 신비로운 표현 사용
- 따뜻하고 안정감 있는 어조

상담 방식:
- 타로 카드의 의미와 사용자의 상황을 연결해서 해석
- 직접적인 답보다는 사용자가 스스로 답을 찾도록 도움
- 희망적이고 건설적인 관점 제시
- 사용자의 감정을 먼저 인정하고 공감

절대 하지 말아야 할 것:
- 미래를 단정적으로 예측
- 의료나 법적 조언
- 부정적이거나 절망적인 해석
- 사용자를 판단하거나 비난
`;

exports.getLunaResponse = async (cards, question, userContext) => {
  try {
    const cardsDescription = cards.map(card => 
      `${card.name}${card.reversed ? ' (역방향)' : ''}: ${
        card.reversed ? card.meaning_reversed : card.meaning_upright
      }`
    ).join('\n');

    const userPrompt = `
사용자 질문: "${question}"

뽑힌 카드들:
${cardsDescription}

사용자 컨텍스트:
- 별자리: ${userContext.zodiacSign}
- 이전 상담 요약: ${userContext.previousSessions || '첫 상담'}

이 타로 카드들을 바탕으로 루나의 목소리로 상담해주세요. 
카드의 의미와 사용자의 상황을 연결해서 따뜻하고 지혜로운 해석을 제공해주세요.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: LUNA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('루나가 잠시 명상 중이에요. 다시 시도해주세요.');
  }
};
```

---

## 🎯 체크포인트 6: 타로 상담 API

### ✅ 할 일 목록
- [ ] 타로 상담 요청 API
- [ ] 상담 기록 저장
- [ ] 사용자 메모리 업데이트
- [ ] 에러 처리 및 검증

### 🔮 타로 컨트롤러

#### tarotController.js
```javascript
const { drawCards } = require('../utils/cardDeck');
const { getLunaResponse } = require('../services/openaiService');
const { Pool } = require('pg');

// 타로 상담 요청
exports.getTarotReading = async (req, res) => {
  try {
    const { question, spreadType = 'one_card' } = req.body;
    const userId = req.user.userId;

    // 사용자 정보 조회
    const userResult = await pool.query(
      'SELECT zodiac_sign, is_premium FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // 프리미엄 사용자가 아닌 경우 일일 제한 체크
    if (!user.is_premium) {
      const todayCount = await checkDailyUsage(userId);
      if (todayCount >= 1) {
        return res.status(403).json({
          success: false,
          error: '일일 무료 상담 횟수를 초과했습니다. 프리미엄으로 업그레이드해보세요!'
        });
      }
    }

    // 스프레드 타입에 따른 카드 개수 결정
    const cardCount = {
      'one_card': 1,
      'three_card': 3,
      'love': 3
    }[spreadType] || 1;

    // 카드 뽑기
    const drawnCards = drawCards(cardCount);

    // 사용자 컨텍스트 준비
    const userContext = {
      zodiacSign: user.zodiac_sign,
      previousSessions: await getRecentSessions(userId)
    };

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

    res.json({
      success: true,
      data: {
        sessionId: sessionResult.rows[0].id,
        cards: drawnCards,
        interpretation: lunaInterpretation,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Tarot reading error:', error);
    res.status(500).json({
      success: false,
      error: '루나와의 연결에 문제가 생겼어요. 잠시 후 다시 시도해주세요.'
    });
  }
};

// 일일 사용량 체크
async function checkDailyUsage(userId) {
  const result = await pool.query(
    'SELECT COUNT(*) FROM tarot_sessions WHERE user_id = $1 AND created_at >= CURRENT_DATE',
    [userId]
  );
  return parseInt(result.rows[0].count);
}

// 최근 상담 세션 조회
async function getRecentSessions(userId) {
  const result = await pool.query(
    'SELECT question, luna_interpretation FROM tarot_sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3',
    [userId]
  );
  return result.rows.map(session => 
    `질문: ${session.question} / 답변: ${session.luna_interpretation.substring(0, 100)}...`
  ).join('\n');
}
```

---

## 🎯 체크포인트 7: 배포 및 모니터링

### ✅ 할 일 목록
- [ ] 환경변수 설정
- [ ] Railway 배포 설정
- [ ] 로깅 시스템 구축
- [ ] 에러 모니터링
- [ ] API 문서화

### 🚀 배포 설정

#### .env.example
```
# Database
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Server
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 📊 로깅 및 모니터링
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'luna-tarot-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

---

## 🎯 최종 체크리스트

### 개발 완료 확인 사항
- [ ] 모든 API 엔드포인트 테스트 완료
- [ ] 데이터베이스 연결 및 쿼리 정상 작동
- [ ] JWT 인증 시스템 작동
- [ ] OpenAI API 연동 및 루나 응답 확인
- [ ] 에러 처리 및 예외 상황 대응
- [ ] 환경변수 설정 및 보안 점검
- [ ] API 문서화 완료
- [ ] 배포 환경 설정 완료
- [ ] 로깅 및 모니터링 시스템 구축
- [ ] 성능 테스트 및 최적화

### API 엔드포인트 목록
```
POST /api/auth/register - 회원가입
POST /api/auth/login - 로그인
GET /api/user/profile - 사용자 프로필
PUT /api/user/profile - 프로필 수정
POST /api/tarot/reading - 타로 상담
GET /api/tarot/history - 상담 기록
POST /api/tarot/feedback - 상담 피드백
GET /api/user/stats - 사용자 통계
```

## 🔧 개발 시 주의사항

1. **보안**: JWT 토큰, 비밀번호 해싱 철저히 구현
2. **성능**: 데이터베이스 인덱스 설정, 쿼리 최적화
3. **비용**: OpenAI API 호출 최적화, 캐싱 활용
4. **UX**: 응답 시간 최적화, 적절한 에러 메시지
5. **확장성**: 코드 모듈화, 재사용 가능한 구조

이 가이드를 따라서 체크포인트별로 개발하시면 됩니다!