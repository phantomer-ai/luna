import api from './api';

export const authAPI = {
  // 회원가입
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  // 로그인
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  // 프로필 조회
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },

  // 프로필 업데이트
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response;
  },

  // 이메일 중복 확인
  checkEmail: async (email) => {
    const response = await api.post('/auth/check-email', { email });
    return response;
  },

  // 사용자명 중복 확인
  checkUsername: async (username) => {
    const response = await api.post('/auth/check-username', { username });
    return response;
  },

  // 토큰 갱신
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response;
  }
};
