import React from 'react';
import { motion } from 'framer-motion';

const TarotReading = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-cosmic text-white font-bold mb-4">
            루나와의 타로 상담
          </h1>
          <p className="text-white/60 text-lg">
            마음속 깊은 질문을 들려주세요. 우주의 지혜로 답해드릴게요.
          </p>
        </motion.div>
        
        <div className="mt-12 text-center">
          <p className="text-white/40">
            타로 상담 기능은 현재 개발 중입니다. 곧 만나뵙겠습니다! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default TarotReading;
