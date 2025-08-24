import React from 'react';
import { motion } from 'framer-motion';

const Premium = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-cosmic text-white font-bold mb-4">
            프리미엄
          </h1>
          <p className="text-white/60 text-lg">
            프리미엄 기능은 현재 개발 중입니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;
