import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
                {!user.isPremium && (
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
                  {!user.isPremium && (
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
