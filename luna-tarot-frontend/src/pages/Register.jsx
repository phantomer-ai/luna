import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      birthDate: formData.birthDate
    });
    
    if (result.success) {
      toast.success('회원가입이 완료되었습니다! 루나와 함께하세요 ✨');
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
            <h1 className="text-2xl font-cosmic text-white font-bold">루나와 함께하기</h1>
            <p className="text-white/60 mt-2">신비로운 여정을 시작해보세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                사용자명
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all input-glow"
                placeholder="사용자명을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all input-glow"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                생년월일
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all input-glow"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all input-glow"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-mystic-400 focus:ring-1 focus:ring-mystic-400 transition-all input-glow"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-mystic-500 to-cosmic-500 text-white font-medium py-3 px-4 rounded-xl hover:from-mystic-600 hover:to-cosmic-600 focus:outline-none focus:ring-2 focus:ring-mystic-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ripple mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>가입 중...</span>
                </div>
              ) : (
                '루나와 함께하기'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="text-mystic-400 hover:text-mystic-300 font-medium transition-colors"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
