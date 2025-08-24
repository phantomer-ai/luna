# 🌙 Luna Tarot - AI 타로 상담사

AI 타로 상담사 루나와 함께하는 신비로운 여행을 시작해보세요. 우주의 지혜를 담은 타로 카드로 당신의 질문에 답해드립니다.

## ✨ 주요 기능

- **AI 타로 상담**: 루나의 직관적인 해석으로 개인화된 타로 상담
- **개인화된 경험**: 별자리와 이전 상담을 고려한 맞춤형 해석
- **24시간 이용**: 언제든지 편리하게 타로 상담을 받을 수 있습니다
- **상담 기록**: 과거 상담 내용을 언제든지 확인 가능
- **프리미엄 서비스**: 무제한 상담과 추가 기능 제공

## 🛠️ 기술 스택

### Backend
- **Node.js** + **Express**
- **PostgreSQL** (데이터베이스)
- **Redis** (캐싱 및 세션 관리)
- **OpenAI API** (AI 타로 해석)
- **JWT** (인증)
- **bcrypt** (비밀번호 암호화)

### Frontend
- **React** + **Vite**
- **Tailwind CSS** (스타일링)
- **Framer Motion** (애니메이션)
- **React Router** (라우팅)
- **Axios** (API 통신)

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd ai_tarot
```

### 2. Backend 설정
```bash
cd luna-tarot-backend

# 의존성 설치
npm install

# 환경변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 값들을 설정하세요

# 데이터베이스 설정
# PostgreSQL과 Redis가 실행 중인지 확인하세요

# 개발 서버 실행
npm run dev
```

### 3. Frontend 설정
```bash
cd luna-tarot-frontend

# 의존성 설치
npm install

# 환경변수 설정
cp env.local .env.local
# .env.local 파일을 편집하여 API URL을 설정하세요

# 개발 서버 실행
npm run dev
```

## 📁 프로젝트 구조

```
ai_tarot/
├── luna-tarot-backend/          # 백엔드 API
│   ├── src/
│   │   ├── config/             # 설정 파일들
│   │   ├── controllers/        # 컨트롤러
│   │   ├── middleware/         # 미들웨어
│   │   ├── models/            # 데이터 모델
│   │   ├── routes/            # 라우터
│   │   ├── services/          # 비즈니스 로직
│   │   └── utils/             # 유틸리티
│   ├── server.js              # 메인 서버 파일
│   └── package.json
├── luna-tarot-frontend/        # 프론트엔드 앱
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── context/          # React Context
│   │   ├── services/         # API 서비스
│   │   ├── hooks/            # 커스텀 훅
│   │   └── utils/            # 유틸리티
│   ├── App.jsx               # 메인 앱 컴포넌트
│   └── package.json
└── README.md
```

## 🔧 환경변수 설정

### Backend (.env)
```env
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
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🌟 주요 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회
- `PUT /api/auth/profile` - 프로필 업데이트

### 타로 상담
- `POST /api/tarot/reading` - 타로 상담 요청
- `GET /api/tarot/history` - 상담 기록 조회
- `POST /api/tarot/feedback` - 상담 피드백 제출
- `GET /api/tarot/daily-usage` - 일일 사용량 조회

## 🎨 디자인 시스템

### 색상 팔레트
- **Cosmic Blue**: `#0ea5e9` ~ `#0c4a6e`
- **Mystic Purple**: `#d946ef` ~ `#701a75`

### 폰트
- **Cosmic**: Orbitron (로고, 제목)
- **Elegant**: Playfair Display (부제목)
- **Body**: Inter (본문)

## 🔮 루나 캐릭터

루나는 신비로운 우주에서 온 25세 여성 타로 상담사입니다:

- **성격**: 따뜻하고 공감능력이 뛰어나며, 신비롭지만 친근한 언니 같은 느낌
- **말투**: 정중한 반말 사용, "우주의 에너지", "별들이 말하길" 같은 신비로운 표현
- **상담 방식**: 타로 카드의 의미와 사용자의 상황을 연결해서 해석, 직접적인 답보다는 사용자가 스스로 답을 찾도록 도움

## 📱 사용법

1. **회원가입/로그인**: 이메일과 비밀번호로 계정을 만드세요
2. **질문 입력**: 마음속 깊은 질문을 루나에게 들려주세요
3. **스프레드 선택**: 원 카드, 쓰리 카드, 연애 스프레드 중 선택
4. **카드 확인**: 루나가 선택한 카드들을 확인하세요
5. **해석 받기**: 루나의 따뜻하고 지혜로운 해석을 받아보세요

## 🚧 개발 상태

- [x] 프로젝트 구조 설정
- [x] 기본 인증 시스템
- [x] 타로 카드 데이터베이스
- [x] OpenAI API 연동
- [x] 기본 UI/UX 구현
- [ ] 타로 상담 완전 구현
- [ ] 상담 기록 시스템
- [ ] 프리미엄 기능
- [ ] 배포 설정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/ai_tarot](https://github.com/your-username/ai_tarot)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
