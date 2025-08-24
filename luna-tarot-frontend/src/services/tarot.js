import api from './api';

export const tarotAPI = {
  // 타로 리딩 요청
  getTarotReading: async (data) => {
    try {
      const response = await api.post('/tarot/reading', data);
      return response;
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
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        '상담 기록을 불러오는데 실패했습니다.'
      );
    }
  },

  // 상담 세션 상세 조회
  getTarotSession: async (sessionId) => {
    try {
      const response = await api.get(`/tarot/session/${sessionId}`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        '상담 세션을 불러오는데 실패했습니다.'
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
      return response;
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
      const response = await api.get('/tarot/daily-usage');
      return response;
    } catch (error) {
      throw new Error('사용량 정보를 불러오는데 실패했습니다.');
    }
  },

  // 스프레드 타입 목록 조회
  getSpreadTypes: async () => {
    try {
      const response = await api.get('/tarot/spread-types');
      return response;
    } catch (error) {
      throw new Error('스프레드 타입을 불러오는데 실패했습니다.');
    }
  }
};
