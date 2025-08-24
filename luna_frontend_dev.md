# 루나 타로 프론트엔드 개발 가이드

## 📋 프로젝트 개요
- **서비스명**: 루나 타로 AI 상담
- **기술스택**: React + Vite + Tailwind CSS + Framer Motion
- **배포**: Vercel
- **디자인**: 신비로운 우주/별자리 테마

---

## 🎯 체크포인트 1: 프로젝트 초기 설정

### ✅ 할 일 목록
- [ ] Vite + React 프로젝트 생성
- [ ] 필수 패키지 설치
- [ ] Tailwind CSS 설정
- [ ] 폴더 구조 생성
- [ ] 환경변수 설정

### 📁 프로젝트 구조
```
luna-tarot-frontend/
├── public/
│   ├── luna-avatar.png
│   ├── tarot-cards/
│   │   ├── fool.jpg
│   │   └── ... (타로카드 이미지들)
│   └── sounds/
│       ├── card-shuffle.mp3
│       └── card-flip.mp3
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loading.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── tarot/
│   │   │   ├── TarotCard.jsx
│   │   │   ├── CardSpread.jsx
│   │   │   ├── CardShuffle.jsx
│   │   │   └── TarotResult.jsx
│   │   └── luna/
│   │       ├── LunaAvatar.jsx
│   │       ├── LunaChat.jsx
│   │       └── LunaSpeech.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── TarotReading.jsx
│   │   ├── Profile.jsx
│   │   ├── History.jsx
│   │   └── Premium.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTarot.js
│   │   └── useLocalStorage.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── TarotContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── tarot.js
│   ├── utils/
│   │   ├── cardAnimations.js
│   │   └── soundEffects.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env.local
├── .env.example
├── package.json
└── vite.config.js
```

### 🔧 초기 설정 명령어
```bash
# 프로젝트 생성
npm create vite@latest luna-tarot-frontend -- --template react
cd luna-tarot-frontend

# 필수 패키지 설치
npm install
npm install react-router-dom axios
npm install @tailwindcss/forms @tailwindcss/typography
npm install framer-motion lucide-react
npm install react-hot-toast react-confetti
npm install @headlessui/react @heroicons/react

# 개발 도구
npm install --save-dev tailwindcss postcss autoprefixer
npm install --save-dev @types/react @types/react-dom
```

### ⚙️ Tailwind 설정
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        mystic: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        }
      },
      fontFamily: {
        'cosmic': ['Orbitron', 'sans-serif'],
        'elegant': ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'card-flip': 'cardFlip 0.6s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 5px #d946ef, 0 0 10px #d946ef, 0 0 15px #d946ef' },
          'to': { boxShadow: '0 0 10px #d946ef, 0 0 20px #d946ef, 0 0 30px #d946ef' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(-90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

---

## 🎯 체크포인트 2: 기본 레이아웃 및 컴포넌트

### ✅ 할 일 목록
- [ ] App.jsx 라우팅 설정
- [ ] Header/Footer 컴포넌트
- [ ] 반응형 레이아웃
- [ ] 로딩 컴포넌트
- [ ] 404 페이지

### 🎨 메인 앱 컴포넌트

#### App.jsx
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TarotProvider } from './context/TarotContext';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import TarotReading from './pages/TarotReading';
import Profile from './pages/Profile';
import History from './pages/History';
import Premium from './pages/Premium';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <TarotProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-mystic-900 to-cosmic-800">
            {/* 별들 배경 효과 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="stars"></div>
              <div className="twinkling"></div>
            </div>
            
            <Header />
            
            <main className="relative z-10 min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reading" element={
                  <ProtectedRoute>
                    <TarotReading />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/premium" element={<Premium />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </TarotProvider>
    </AuthProvider>
  );
}

export default App;
```

#### Header.jsx
```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 bg-gradient-to-br from-mystic-400 to-cosmic-400 rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">🌙</span>
            </motion.div>
            <span className="text-2xl font-cosmic text-white font-bold">
              Luna Tarot
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/reading"
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  타로 상담
                </Link>
                <Link
                  to="/history"
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  상담 기록
                </Link>
                {!user.is_premium && (
                  <Link
                    to="/premium"
                    className="bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-mystic-600 hover:to-cosmic-600 transition-all duration-200"
                  >
                    프리미엄
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white/80 hover:text-white">
                    <span>{user.username}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md rounded-lg shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-t-lg"
                    >
                      프로필
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-b-lg"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-mystic-600 hover:to-cosmic-600 transition-all duration-200"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10"
          >
            <div className="px-6 py-4 space-y-4">
              {user ? (
                <>
                  <Link to="/reading" className="block text-white/80 hover:text-white">
                    타로 상담
                  </Link>
                  <Link to="/history" className="block text-white/80 hover:text-white">
                    상담 기록
                  </Link>
                  <Link to="/profile" className="block text-white/80 hover:text-white">
                    프로필
                  </Link>
                  {!user.is_premium && (
                    <Link to="/premium" className="block text-mystic-400 hover:text-mystic-300">
                      프리미엄
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block text-white/80 hover:text-white"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-white/80 hover:text-white">
                    로그인
                  </Link>
                  <Link to="/register" className="block text-white/80 hover:text-white">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Header;
```

---

## 🎯 체크포인트 3: 인증 시스템

### ✅ 할 일 목록
- [ ] 로그인/회원가입 폼
- [ ] AuthContext 구현
- [ ] 로컬 스토리지 토큰 관리
- [ ] API 인증 헤더 설정
- [ ] 보호된 라우트

#### useAuth.js
```javascript
import { useState, useEffect, useContext, createContext } from 'react';
import { authAPI } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth-token'));

  useEffect(() => {
    if (token) {
      // 토큰으로 사용자 정보 조회
      authAPI.getProfile()
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // 토큰이 만료되었거나 유효하지 않음
          localStorage.removeItem('auth-token');
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('auth-token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || '로그인에 실패했습니다.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;
      
      localStorage.setItem('auth-token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || '회원가입에 실패했습니다.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### LoginForm.jsx
```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('환영합니다! 루나가 기다리고 있어요 ✨');
      navigate('/reading');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-mystic-400 to-cosmic-400 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">🌙</span>
            </motion.div>
            <h1 className="text-2xl font-cosmic text-white font-bold">루나와 만나기</h1>
            <p className="text-white/60 mt-2">우주의 지혜로 당신을 안내할게요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-medium py-3 px-4 rounded-xl hover:from-mystic-600 hover:to-cosmic-600 focus:outline-none focus:ring-2 focus:ring-mystic-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>연결 중...</span>
                </div>
              ) : (
                '루나와 연결하기'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              아직 계정이 없으신가요?{' '}
              <Link
                to="/register"
                className="text-mystic-400 hover:text-mystic-300 font-medium transition-colors"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
```

---

## 🎯 체크포인트 4: 타로 카드 컴포넌트

### ✅ 할 일 목록
- [ ] 타로 카드 컴포넌트
- [ ] 카드 셔플 애니메이션
- [ ] 카드 스프레드 레이아웃
- [ ] 카드 뒤집기 애니메이션
- [ ] 사운드 이펙트 (선택사항)

#### TarotCard.jsx
```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TarotCard = ({ 
  card, 
  isRevealed = false, 
  onReveal, 
  position, 
  size = 'medium',
  glowEffect = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!isRevealed && onReveal) {
      setIsFlipped(true);
      setTimeout(() => {
        onReveal(card);
      }, 300);
    }
  };

  const cardSizes = {
    small: 'w-20 h-32',
    medium: 'w-24 h-40',
    large: 'w-32 h-52'
  };

  const cardVariants = {
    hidden: { 
      rotateY: 0,
      scale: 0.8,
      opacity: 0.7
    },
    visible: { 
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: position * 0.2 }
    },
    flipped: {
      rotateY: 180,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      className={`${cardSizes[size]} cursor-pointer relative`}
      variants={cardVariants}
      initial="hidden"
      animate={isFlipped ? "flipped" : "visible"}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: glowEffect ? '0 10px 40px rgba(217, 70, 239, 0.3)' : 'none'
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-full h-full preserve-3d">
        {/* 카드 뒷면 */}
        <div className="absolute inset-0 backface-hidden rounded-lg border-2 border-mystic-300/30 bg-gradient-to-br from-cosmic-800 via-mystic-800 to-cosmic-900 flex items-center justify-center shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-mystic-400 to-cosmic-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌙</span>
            </div>
            <div className="text-white/60 text-xs font-cosmic">LUNA</div>
          </div>
        </div>

        {/* 카드 앞면 */}
        {(isRevealed || isFlipped) && (
          <motion.div
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg border-2 border-mystic-300/30 bg-white shadow-xl overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* 카드 이미지 영역 */}
              <div className="flex-1 bg-gradient-to-br from-mystic-50 to-cosmic-50 p-2 flex items-center justify-center">
                {card?.image ? (
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-4xl">
                    {getCardEmoji(card?.name)}
                  </div>
                )}
                {card?.reversed && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    역방향
                  </div>
                )}
              </div>
              
              {/* 카드 이름 */}
              <div className="bg-gradient-to-r from-mystic-600 to-cosmic-600 text-white text-center py-2">
                <div className="text-xs font-bold">
                  {card?.name || 'Unknown Card'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 카드별 이모지 매핑 (이미지가 없을 때 대체용)
const getCardEmoji = (cardName) => {
  const emojiMap = {
    'The Fool': '🃏',
    'The Magician': '🎩',
    'The High Priestess': '🔮',
    'The Empress': '👑',
    'The Emperor': '⚔️',
    'The Hierophant': '📿',
    'The Lovers': '💕',
    'The Chariot': '🏺',
    'Strength': '🦁',
    'The Hermit': '🕯️',
    'Wheel of Fortune': '🎰',
    'Justice': '⚖️',
    'The Hanged Man': '🙃',
    'Death': '💀',
    'Temperance': '🍷',
    'The Devil': '😈',
    'The Tower': '🗼',
    'The Star': '⭐',
    'The Moon': '🌙',
    'The Sun': '☀️',
    'Judgement': '📯',
    'The World': '🌍'
  };
  
  return emojiMap[cardName] || '🃏';
};

export default TarotCard;
```

#### CardShuffle.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CardShuffle = ({ onShuffleComplete, isShuffling = false }) => {
  const [shuffleProgress, setShuffleProgress] = useState(0);
  
  useEffect(() => {
    if (isShuffling) {
      const interval = setInterval(() => {
        setShuffleProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onShuffleComplete?.();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isShuffling, onShuffleComplete]);

  const cards = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-64 h-40">
        {cards.map((card, index) => (
          <motion.div
            key={card}
            className="absolute w-20 h-32 bg-gradient-to-br from-cosmic-800 via-mystic-800 to-cosmic-900 rounded-lg border-2 border-mystic-300/30 shadow-xl"
            initial={{ 
              x: Math.random() * 200 - 100,
              y: Math.random() * 80 - 40,
              rotate: Math.random() * 360
            }}
            animate={isShuffling ? {
              x: [
                Math.random() * 200 - 100,
                Math.random() * 200 - 100,
                Math.random() * 200 - 100,
                (index - 3.5) * 25
              ],
              y: [
                Math.random() * 80 - 40,
                Math.random() * 80 - 40,
                Math.random() * 80 - 40,
                index * 2
              ],
              rotate: [
                Math.random() * 360,
                Math.random() * 360,
                Math.random() * 360,
                0
              ]
            } : {}}
            transition={{
              duration: 2,
              times: [0, 0.3, 0.7, 1],
              ease: "easeInOut"
            }}
            style={{ zIndex: 10 - index }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-mystic-400 to-cosmic-400 rounded-full flex items-center justify-center">
                <span className="text-xl">🌙</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isShuffling && (
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 mx-auto mb-2 text-mystic-400"
          >
            ✨
          </motion.div>
          <p className="text-white/80 text-sm">
            루나가 우주의 에너지로 카드를 섞고 있어요...
          </p>
          <div className="w-48 h-2 bg-white/10 rounded-full mt-3">
            <motion.div
              className="h-full bg-gradient-to-r from-mystic-500 to-cosmic-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${shuffleProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {!isShuffling && shuffleProgress === 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 text-center text-sm max-w-md"
        >
          마음속으로 질문을 떠올리며 카드들이 준비될 때까지 기다려주세요. 
          우주의 에너지가 당신의 질문에 맞는 답을 준비하고 있어요.
        </motion.p>
      )}
    </div>
  );
};

export default CardShuffle;
```

---

## 🎯 체크포인트 5: 타로 리딩 메인 페이지

### ✅ 할 일 목록
- [ ] 타로 리딩 페이지 레이아웃
- [ ] 질문 입력 폼
- [ ] 스프레드 타입 선택
- [ ] 루나와의 대화 인터페이스
- [ ] 결과 표시 컴포넌트

#### TarotReading.jsx
```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTarot } from '../hooks/useTarot';
import { useAuth } from '../hooks/useAuth';
import CardShuffle from '../components/tarot/CardShuffle';
import TarotCard from '../components/tarot/TarotCard';
import LunaAvatar from '../components/luna/LunaAvatar';
import toast from 'react-hot-toast';

const TarotReading = () => {
  const { user } = useAuth();
  const { getTarotReading, loading } = useTarot();
  
  const [step, setStep] = useState('question'); // question -> shuffle -> cards -> result
  const [question, setQuestion] = useState('');
  const [spreadType, setSpreadType] = useState('one_card');
  const [cards, setCards] = useState([]);
  const [interpretation, setInterpretation] = useState('');
  const [revealedCards, setRevealedCards] = useState([]);

  const spreadTypes = {
    one_card: { name: '원 카드', description: '오늘의 메시지나 간단한 질문', cardCount: 1 },
    three_card: { name: '쓰리 카드', description: '과거-현재-미래 또는 상황 분석', cardCount: 3 },
    love: { name: '연애 스프레드', description: '나-상대방-관계에 대한 이해', cardCount: 3 }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('질문을 입력해주세요!');
      return;
    }

    // 무료 사용자 일일 제한 체크
    if (!user.is_premium) {
      // 여기서 일일 사용 횟수 체크 로직 추가
    }

    setStep('shuffle');
  };

  const handleShuffleComplete = async () => {
    try {
      const response = await getTarotReading({
        question,
        spreadType
      });

      setCards(response.cards);
      setInterpretation(response.interpretation);
      setStep('cards');
    } catch (error) {
      toast.error(error.message || '타로 리딩에 실패했습니다.');
      setStep('question');
    }
  };

  const handleCardReveal = (card, index) => {
    setRevealedCards(prev => [...prev, index]);
    
    // 모든 카드가 공개되면 해석 단계로
    if (revealedCards.length + 1 >= cards.length) {
      setTimeout(() => {
        setStep('result');
      }, 1000);
    }
  };

  const resetReading = () => {
    setStep('question');
    setQuestion('');
    setCards([]);
    setInterpretation('');
    setRevealedCards([]);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* 루나 아바타 - 항상 표시 */}
        <div className="text-center mb-8">
          <LunaAvatar 
            mood={step === 'result' ? 'happy' : 'neutral'}
            isThinking={loading || step === 'shuffle'}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: 질문 입력 */}
          {step === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-cosmic text-white font-bold mb-2">
                    루나에게 질문하기
                  </h1>
                  <p className="text-white/60">
                    마음속 깊은 질문을 들려주세요. 우주의 지혜로 답해드릴게요.
                  </p>
                </div>

                {/* 스프레드 타입 선택 */}
                <div className="mb-6">
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    상담 방식 선택
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(spreadTypes).map(([key, spread]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSpreadType(key)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          spreadType === key
                            ? 'border-mystic-400 bg-mystic-400/20 text-white'
                            : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                        }`}
                      >
                        <div className="font-medium mb-1">{spread.name}</div>
                        <div className="text-xs opacity-75">{spread.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 질문 입력 */}
                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      질문을 입력해주세요
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="예: 새로운 직장에서 어떻게 적응해야 할까요?"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all resize-none h-32"
                      maxLength={500}
                    />
                    <div className="text-right text-white/40 text-xs mt-1">
                      {question.length}/500
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="w-full bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-medium py-4 px-6 rounded-xl hover:from-mystic-600 hover:to-cosmic-600 focus:outline-none focus:ring-2 focus:ring-mystic-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '준비 중...' : '루나와 상담 시작하기 ✨'}
                  </motion.button>
                </form>

                {/* 무료 사용자 안내 */}
                {!user.is_premium && (
                  <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-400">⭐</span>
                      <div className="text-amber-300 text-sm">
                        무료 사용자는 하루에 1회 상담이 가능합니다. 
                        <button className="underline ml-1 hover:text-amber-200">
                          프리미엄으로 업그레이드하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: 카드 셔플 */}
          {step === 'shuffle' && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-cosmic text-white font-bold mb-2">
                  우주의 에너지가 모이고 있어요
                </h2>
                <p className="text-white/60 max-w-md mx-auto">
                  "{question}"에 대한 답을 찾기 위해 카드들이 준비되고 있습니다.
                </p>
              </div>
              
              <CardShuffle 
                isShuffling={true}
                onShuffleComplete={handleShuffleComplete}
              />
            </motion.div>
          )}

          {/* Step 3: 카드 공개 */}
          {step === 'cards' && (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-cosmic text-white font-bold mb-2">
                  당신을 위한 카드가 선택되었어요
                </h2>
                <p className="text-white/60">
                  카드를 클릭해서 메시지를 확인해보세요
                </p>
              </div>

              <div className="flex justify-center items-center space-x-6 mb-8">
                {cards.map((card, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <TarotCard
                      card={card}
                      position={index}
                      size="large"
                      isRevealed={revealedCards.includes(index)}
                      onReveal={() => handleCardReveal(card, index)}
                      glowEffect={true}
                    />
                    {spreadType === 'three_card' && (
                      <div className="mt-3 text-white/60 text-sm">
                        {index === 0 && '과거'}
                        {index === 1 && '현재'}
                        {index === 2 && '미래'}
                      </div>
                    )}
                    {spreadType === 'love' && (
                      <div className="mt-3 text-white/60 text-sm">
                        {index === 0 && '나'}
                        {index === 1 && '상대방'}
                        {index === 2 && '관계'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {revealedCards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/60 text-sm"
                >
                  루나가 카드의 메시지를 해석하고 있어요...
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: 해석 결과 */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-cosmic text-white font-bold mb-2">
                    루나의 메시지
                  </h2>
                  <p className="text-white/60">
                    우주가 당신에게 전하는 지혜입니다
                  </p>
                </div>

                {/* 선택된 카드들 요약 */}
                <div className="flex justify-center space-x-4 mb-8">
                  {cards.map((card, index) => (
                    <TarotCard
                      key={index}
                      card={card}
                      isRevealed={true}
                      size="small"
                    />
                  ))}
                </div>

                {/* 루나의 해석 */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-mystic-400 to-cosmic-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🌙</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-mystic-300 font-medium mb-2">Luna</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/90 leading-relaxed whitespace-pre-wrap"
                      >
                        {interpretation}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetReading}
                    className="px-6 py-3 bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-medium rounded-xl hover:from-mystic-600 hover:to-cosmic-600 transition-all"
                  >
                    새로운 질문하기
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                  >
                    상담 기록에 저장
                  </motion.button>

                  {!user.is_premium && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
                    >
                      ⭐ 프리미엄으로 더 많은 상담받기
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TarotReading;
```

---

## 🎯 체크포인트 6: 루나 아바타 컴포넌트

### ✅ 할 일 목록
- [ ] 루나 캐릭터 아바타
- [ ] 감정 상태별 표현
- [ ] 말하는 애니메이션
- [ ] 호버 인터랙션

#### LunaAvatar.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';

const LunaAvatar = ({ 
  mood = 'neutral', // neutral, happy, thinking, mystical
  isThinking = false,
  size = 'large' // small, medium, large
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  const getMoodExpression = () => {
    switch (mood) {
      case 'happy':
        return { eyes: '✨', mouth: '😊' };
      case 'thinking':
        return { eyes: '🤔', mouth: '💭' };
      case 'mystical':
        return { eyes: '🔮', mouth: '🌙' };
      default:
        return { eyes: '👁️', mouth: '✨' };
    }
  };

  const expression = getMoodExpression();

  return (
    <div className="flex flex-col items-center">
      {/* 아바타 메인 */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 1, -1, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* 후광 효과 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(217, 70, 239, 0.5)',
              '0 0 40px rgba(14, 165, 233, 0.5)',
              '0 0 20px rgba(217, 70, 239, 0.5)'
            ]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* 아바타 베이스 */}
        <div className="relative w-full h-full bg-gradient-to-br from-mystic-400 via-cosmic-500 to-mystic-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
          
          {/* 별들 장식 */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${15 + i * 12}%`
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* 루나 얼굴 */}
          <div className="text-4xl font-bold text-white z-10">
            🌙
          </div>
          
          {/* 눈과 입 표현 (옵션) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-lg opacity-80">
              {expression.eyes}
            </div>
          </div>
        </div>

        {/* 생각하는 중 표시 */}
        {isThinking && (
          <motion.div
            className="absolute -top-6 -right-2"
            animate={{ 
              y: [-5, -10, -5],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white/90 rounded-full px-2 py-1 text-xs">
              💭
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 루나 이름 및 상태 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <h3 className="text-white font-cosmic font-bold text-lg">Luna</h3>
        <p className="text-white/60 text-sm">
          {isThinking ? '깊이 생각하고 있어요...' : '우주의 타로 상담사'}
        </p>
      </motion.div>

      {/* 감정 상태별 메시지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-2 text-center max-w-md"
      >
        {mood === 'happy' && (
          <p className="text-mystic-300 text-sm">
            "우주의 에너지가 당신에게 좋은 소식을 전하고 있어요! ✨"
          </p>
        )}
        {mood === 'thinking' && (
          <p className="text-cosmic-300 text-sm">
            "별들의 속삭임을 듣고 있어요. 잠시만 기다려주세요..."
          </p>
        )}
        {mood === 'mystical' && (
          <p className="text-white/80 text-sm">
            "신비로운 우주의 힘이 우리 주변에 흐르고 있어요 🔮"
          </p>
        )}
        {mood === 'neutral' && (
          <p className="text-white/60 text-sm">
            "안녕하세요! 오늘은 어떤 질문을 가져오셨나요?"
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default LunaAvatar;
```

---

## 🎯 체크포인트 7: API 서비스 레이어

### ✅ 할 일 목록
- [ ] API 클라이언트 설정
- [ ] 인증 서비스
- [ ] 타로 서비스
- [ ] 에러 처리
- [ ] 로딩 상태 관리

#### api.js (기본 설정)
```javascript
import axios from 'axios';
import toast from 'react-hot-toast';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 인증 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 인증 만료
          localStorage.removeItem('auth-token');
          toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
          break;
          
        case 403:
          toast.error(data.error || '권한이 없습니다.');
          break;
          
        case 429:
          toast.error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
          break;
          
        case 500:
          toast.error('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
          
        default:
          toast.error(data.error || '알 수 없는 오류가 발생했습니다.');
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.');
    } else {
      toast.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

#### tarot.js (타로 서비스)
```javascript
import api from './api';

export const tarotAPI = {
  // 타로 리딩 요청
  getTarotReading: async (data) => {
    try {
      const response = await api.post('/tarot/reading', data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        '타로 상담 중 오류가 발생했습니다.'
      );
    }
  },

  // 상담 기록 조회
  getTarotHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/tarot/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        '상담 기록을 불러오는데 실패했습니다.'
      );
    }
  },

  // 상담 피드백 제출
  submitFeedback: async (sessionId, rating, comment) => {
    try {
      const response = await api.post('/tarot/feedback', {
        sessionId,
        rating,
        comment
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        '피드백 제출에 실패했습니다.'
      );
    }
  },

  // 일일 사용량 확인
  getDailyUsage: async () => {
    try {
      const response = await api.get('/user/daily-usage');
      return response.data;
    } catch (error) {
      throw new Error('사용량 정보를 불러오는데 실패했습니다.');
    }
  }
};
```

#### useTarot.js (커스텀 훅)
```javascript
import { useState } from 'react';
import { tarotAPI } from '../services/tarot';

export const useTarot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTarotReading = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tarotAPI.getTarotReading(data);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTarotHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tarotAPI.getTarotHistory(page);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (sessionId, rating, comment) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tarotAPI.submitFeedback(sessionId, rating, comment);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getTarotReading,
    getTarotHistory,
    submitFeedback
  };
};
```

---

## 🎯 체크포인트 8: 스타일링 및 애니메이션

### ✅ 할 일 목록
- [ ] 글로벌 CSS 스타일
- [ ] 별자리 배경 효과
- [ ] 커스텀 애니메이션
- [ ] 반응형 디자인
- [ ] 다크 테마

#### globals.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Playfair+Display:wght@400;600;700&display=swap');

/* 기본 스타일 */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #0c4a6e 0%, #701a75 100%);
  overflow-x: hidden;
}

/* 별자리 배경 효과 */
.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stars::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  box-shadow: 
    25px 5px 0 white,
    50px 25px 0 white,
    75px 10px 0 white,
    100px 35px 0 white,
    125px 15px 0 white,
    150px 40px 0 white,
    175px 20px 0 white,
    200px 45px 0 white,
    225px 30px 0 white,
    250px 55px 0 white,
    275px 35px 0 white,
    300px 60px 0 white,
    325px 40px 0 white,
    350px 65px 0 white,
    375px 45px 0 white,
    400px 70px 0 white,
    425px 50px 0 white,
    450px 75px 0 white,
    475px 55px 0 white,
    500px 80px 0 white,
    525px 60px 0 white,
    550px 85px 0 white,
    575px 65px 0 white,
    600px 90px 0 white,
    625px 70px 0 white,
    650px 95px 0 white,
    675px 75px 0 white,
    700px 100px 0 white,
    725px 80px 0 white,
    750px 105px 0 white,
    775px 85px 0 white,
    800px 110px 0 white,
    825px 90px 0 white,
    850px 115px 0 white,
    875px 95px 0 white,
    900px 120px 0 white,
    925px 100px 0 white,
    950px 125px 0 white,
    975px 105px 0 white,
    1000px 130px 0 white,
    1025px 110px 0 white,
    1050px 135px 0 white,
    1075px 115px 0 white,
    1100px 140px 0 white,
    1125px 120px 0 white,
    1150px 145px 0 white,
    1175px 125px 0 white,
    1200px 150px 0 white,
    1225px 130px 0 white,
    1250px 155px 0 white;
  animation: sparkle 4s infinite linear;
}

.twinkling {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.twinkling::before {
  content: '';
  position: absolute;
  width: 1px;
  height: 1px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 
    50px 50px 0 rgba(255, 255, 255, 0.6),
    150px 100px 0 rgba(255, 255, 255, 0.4),
    250px 150px 0 rgba(255, 255, 255, 0.8),
    350px 200px 0 rgba(255, 255, 255, 0.5),
    450px 250px 0 rgba(255, 255, 255, 0.7),
    550px 300px 0 rgba(255, 255, 255, 0.3),
    650px 350px 0 rgba(255, 255, 255, 0.9),
    750px 400px 0 rgba(255, 255, 255, 0.6),
    850px 450px 0 rgba(255, 255, 255, 0.4),
    950px 500px 0 rgba(255, 255, 255, 0.8),
    1050px 550px 0 rgba(255, 255, 255, 0.5),
    1150px 600px 0 rgba(255, 255, 255, 0.7);
  animation: twinkling 3s infinite ease-in-out alternate;
}

@keyframes sparkle {
  0%, 20%, 40%, 60%, 80%, 100% {
    opacity: 0;
  }
  10%, 30%, 50%, 70%, 90% {
    opacity: 1;
  }
}

@keyframes twinkling {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 카드 3D 효과 */
.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* 커스텀 스크롤바 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #d946ef, #0ea5e9);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #c026d3, #0284c7);
}

/* 로딩 애니메이션 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 5px rgba(217, 70, 239, 0.5);
  }
  50% {
    opacity: 0.5;
    box-shadow: 0 0 20px rgba(217, 70, 239, 0.8), 0 0 30px rgba(14, 165, 233, 0.6);
  }
}

.pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* 그라디언트 텍스트 */
.gradient-text {
  background: linear-gradient(135deg, #d946ef, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 반응형 텍스트 */
@media (max-width: 640px) {
  .text-responsive-xl {
    font-size: 1.5rem;
  }
  .text-responsive-2xl {
    font-size: 1.75rem;
  }
  .text-responsive-3xl {
    font-size: 2rem;
  }
}

@media (min-width: 641px) {
  .text-responsive-xl {
    font-size: 1.75rem;
  }
  .text-responsive-2xl {
    font-size: 2.25rem;
  }
  .text-responsive-3xl {
    font-size: 3rem;
  }
}

/* 카드 호버 효과 */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

/* 버튼 리플 효과 */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.6s, height 0.6s;
  transform: translate(-50%, -50%);
}

.ripple:active::before {
  width: 300px;
  height: 300px;
}

/* 모달 백드롭 */
.modal-backdrop {
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
}

/* 토스트 커스텀 스타일 */
.toast-success {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important;
  border-radius: 12px !important;
}

.toast-error {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
  border-radius: 12px !important;
}

/* 입력 필드 포커스 효과 */
.input-glow:focus {
  box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.5), 0 0 20px rgba(217, 70, 239, 0.3);
}

/* 카드 셔플 애니메이션 */
@keyframes shuffle {
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-20px) rotate(-5deg); }
  50% { transform: translateX(20px) rotate(5deg); }
  75% { transform: translateX(-10px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

.shuffle-animation {
  animation: shuffle 0.5s ease-in-out;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .container-mobile {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-mobile-sm {
    font-size: 0.875rem;
  }
  
  .space-mobile-y-4 > * + * {
    margin-top: 1rem;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .bg-black\/40 {
    background-color: rgba(0, 0, 0, 0.8) !important;
  }
  
  .border-white\/10 {
    border-color: rgba(255, 255, 255, 0.3) !important;
  }
  
  .text-white\/60 {
    color: rgba(255, 255, 255, 0.9) !important;
  }
}
```

---

## 🎯 체크포인트 9: 배포 및 환경 설정

### ✅ 할 일 목록
- [ ] 환경변수 설정
- [ ] Vercel 배포 설정
- [ ] 빌드 최적화
- [ ] SEO 메타태그
- [ ] PWA 설정 (선택사항)

#### .env.example
```bash
# API 서버 URL
VITE_API_BASE_URL=http://localhost:3000/api

# 환경 설정
VITE_NODE_ENV=development

# 외부 서비스 (필요시)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# 기능 플래그
VITE_ENABLE_SOUND_EFFECTS=true
VITE_ENABLE_ANALYTICS=false
```

#### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@headlessui/react'],
          utils: ['axios', 'react-hot-toast']
        }
      }
    },
    target: 'esnext',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3001,
    open: true,
    cors: true
  },
  preview: {
    port: 3002
  }
})
```

#### vercel.json
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url"
  }
}
```

#### index.html (SEO 최적화)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO 메타태그 -->
  <title>Luna Tarot - AI 타로 상담사 루나와 함께하는 신비로운 여행</title>
  <meta name="description" content="AI 타로 상담사 루나와 함께 인생의 답을 찾아보세요. 24시간 언제든지 개인화된 타로 상담을 받을 수 있습니다." />
  <meta name="keywords" content="타로, 타로카드, AI 상담, 운세, 점술, 루나, 신비, 우주" />
  <meta name="author" content="Luna Tarot Team" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Luna Tarot - AI 타로 상담사" />
  <meta property="og:description" content="AI 타로 상담사 루나와 함께하는 신비로운 타로 상담 서비스" />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content="https://luna-tarot.vercel.app" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Luna Tarot - AI 타로 상담사" />
  <meta name="twitter:description" content="AI 타로 상담사 루나와 함께하는 신비로운 타로 상담 서비스" />
  <meta name="twitter:image" content="/twitter-image.png" />
  
  <!-- 폰트 미리 로드 -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- 테마 컬러 -->
  <meta name="theme-color" content="#d946ef" />
  
  <!-- iOS Safari -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- 구조화된 데이터 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Luna Tarot",
    "description": "AI 타로 상담사 루나와 함께하는 신비로운 타로 상담 서비스",
    "url": "https://luna-tarot.vercel.app",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "category": "subscription"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 🎯 최종 체크리스트

### 개발 완료 확인 사항
- [ ] 모든 컴포넌트 구현 완료
- [ ] 라우팅 설정 및 네비게이션 테스트
- [ ] API 연동 및 에러 처리 확인
- [ ] 반응형 디자인 테스트 (모바일, 태블릿, 데스크톱)
- [ ] 크로스 브라우저 호환성 검증
- [ ] 성능 최적화 (Lighthouse 점수 90+ 목표)
- [ ] 접근성 검증 (WCAG 2.1 AA 준수)
- [ ] SEO 최적화 완료
- [ ] 환경변수 및 보안 설정
- [ ] 배포 파이프라인 구축

### 테스트 시나리오
```
1. 회원가입/로그인 플로우
2. 타로 상담 전체 과정 (질문 → 셔플 → 카드 → 결과)
3. 무료/프리미엄 사용자 제한 기능
4. 상담 기록 저장 및 조회
5. 프로필 수정 기능
6. 모바일 터치 인터랙션
7. 네트워크 오류 시 에러 처리
8. 로딩 상태 및 UX 흐름
```

### 성능 최적화 체크포인트
- [ ] 이미지 최적화 (WebP, 레이지 로딩)
- [ ] 코드 스플리팅 및 청크 최적화
- [ ] 폰트 최적화 (font-display: swap)
- [ ] 캐싱 전략 설정
- [ ] Bundle size 분석 및 최적화
- [ ] Core Web Vitals 개선

### 배포 전 최종 점검
- [ ] 모든 환경변수 설정 확인
- [ ] 프로덕션 빌드 테스트
- [ ] API 엔드포인트 연결 확인
- [ ] 외부 의존성 (이미지, 폰트 등) 로드 확인
- [ ] 에러 모니터링 설정
- [ ] 구글 애널리틱스 연동 (선택사항)
- [ ] 도메인 연결 및 SSL 인증서 설정

---

## 🚀 개발 순서 가이드

### 1단계: 기본 설정 (1-2일)
1. 프로젝트 초기화 및 패키지 설치
2. 폴더 구조 생성
3. Tailwind CSS 및 기본 스타일 설정
4. 라우팅 설정

### 2단계: 인증 시스템 (2-3일)
1. AuthContext 및 API 설정
2. 로그인/회원가입 페이지
3. 보호된 라우트 설정
4. 토큰 관리 로직

### 3단계: 핵심 타로 기능 (3-4일)
1. 타로 카드 컴포넌트
2. 카드 셔플 애니메이션
3. 타로 리딩 페이지
4. 백엔드 API 연동

### 4단계: UI/UX 개선 (2-3일)
1. 루나 아바타 컴포넌트
2. 애니메이션 및 인터랙션
3. 반응형 디자인
4. 접근성 개선

### 5단계: 추가 기능 (2-3일)
1. 상담 기록 페이지
2. 프로필 관리
3. 프리미엄 기능
4. 피드백 시스템

### 6단계: 테스트 및 배포 (1-2일)
1. 크로스 브라우저 테스트
2. 성능 최적화
3. 배포 설정
4. 모니터링 구축

이 가이드를 따라 단계별로 개발하시면 완성도 높은 루나 타로 서비스를 만들 수 있습니다!
    