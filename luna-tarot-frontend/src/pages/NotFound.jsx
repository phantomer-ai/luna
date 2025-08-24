import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl font-cosmic text-white font-bold mb-4">404</div>
          <h1 className="text-3xl font-cosmic text-white font-bold mb-4">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-white/60 text-lg mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <Link
            to="/"
            className="bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-bold py-3 px-6 rounded-xl hover:from-mystic-600 hover:to-cosmic-600 transition-all duration-200"
          >
            홈으로 돌아가기
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
