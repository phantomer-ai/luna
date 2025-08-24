import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* 메인 헤드라인 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-gradient-to-br from-mystic-400 to-cosmic-400 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <span className="text-4xl">🌙</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-cosmic font-bold text-white mb-6">
            Luna Tarot
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            AI 타로 상담사 루나와 함께하는 신비로운 여행
          </p>
          
          <p className="text-lg text-white/60 mb-12 max-w-3xl mx-auto">
            우주의 지혜를 담은 타로 카드로 당신의 질문에 답해드립니다. 
            루나가 당신의 마음을 읽고, 인생의 방향을 안내해드릴게요.
          </p>
        </motion.div>

        {/* 주요 기능들 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-mystic-500 to-cosmic-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔮</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI 타로 상담</h3>
            <p className="text-white/70">
              루나의 직관적인 해석으로 당신의 질문에 답해드립니다
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-mystic-500 to-cosmic-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">개인화된 경험</h3>
            <p className="text-white/70">
              별자리와 이전 상담을 고려한 맞춤형 해석을 제공합니다
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-mystic-500 to-cosmic-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">언제든 이용</h3>
            <p className="text-white/70">
              24시간 언제든지 편리하게 타로 상담을 받을 수 있습니다
            </p>
          </div>
        </motion.div>

        {/* CTA 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {user ? (
            <Link
              to="/reading"
              className="bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-mystic-600 hover:to-cosmic-600 transition-all duration-200 transform hover:scale-105"
            >
              루나와 상담하기 ✨
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-bold py-4 px-8 rounded-xl text-lg hover:from-mystic-600 hover:to-cosmic-600 transition-all duration-200 transform hover:scale-105"
              >
                무료로 시작하기 ✨
              </Link>
              <Link
                to="/login"
                className="bg-white/10 border border-white/20 text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/20 transition-all duration-200"
              >
                로그인
              </Link>
            </>
          )}
        </motion.div>

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-white/50 text-sm">
            무료 사용자는 하루에 1회, 프리미엄 사용자는 무제한 상담 가능
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
