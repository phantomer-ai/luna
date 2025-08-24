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
