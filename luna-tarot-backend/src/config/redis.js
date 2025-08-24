import Redis from 'ioredis';

// Redis 클라이언트 생성 (선택적 연결)
let redis = null;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
} catch (error) {
  console.warn('⚠️ Redis 연결 실패, 메모리 기반 캐시를 사용합니다:', error.message);
  redis = null;
}

// 연결 이벤트 핸들러
redis.on('connect', () => {
  console.log('✅ Redis에 연결되었습니다.');
});

redis.on('error', (err) => {
  console.error('❌ Redis 연결 오류:', err);
});

redis.on('close', () => {
  console.log('🔌 Redis 연결이 종료되었습니다.');
});

// 메모리 기반 캐시 (Redis가 없을 때 사용)
const memoryCache = new Map();

// Redis 유틸리티 함수들
export const redisUtils = {
  // 캐시 설정
  async setCache(key, value, ttl = 3600) {
    try {
      if (redis) {
        await redis.setex(key, ttl, JSON.stringify(value));
      } else {
        // 메모리 기반 캐시
        memoryCache.set(key, {
          value: JSON.stringify(value),
          expires: Date.now() + (ttl * 1000)
        });
      }
      return true;
    } catch (error) {
      console.error('캐시 설정 오류:', error);
      return false;
    }
  },

  // 캐시 조회
  async getCache(key) {
    try {
      if (redis) {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // 메모리 기반 캐시
        const cached = memoryCache.get(key);
        if (cached && cached.expires > Date.now()) {
          return JSON.parse(cached.value);
        }
        memoryCache.delete(key);
        return null;
      }
    } catch (error) {
      console.error('캐시 조회 오류:', error);
      return null;
    }
  },

  // 캐시 삭제
  async deleteCache(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis 캐시 삭제 오류:', error);
      return false;
    }
  },

  // 패턴으로 캐시 삭제
  async deleteCachePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Redis 패턴 캐시 삭제 오류:', error);
      return false;
    }
  },

  // 사용자 세션 관리
  async setUserSession(userId, sessionData, ttl = 86400) {
    const key = `session:${userId}`;
    return await this.setCache(key, sessionData, ttl);
  },

  async getUserSession(userId) {
    const key = `session:${userId}`;
    return await this.getCache(key);
  },

  async deleteUserSession(userId) {
    const key = `session:${userId}`;
    return await this.deleteCache(key);
  },

  // 일일 사용량 추적
  async incrementDailyUsage(userId) {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_usage:${userId}:${today}`;
    try {
      const count = await redis.incr(key);
      await redis.expire(key, 86400); // 24시간 후 만료
      return count;
    } catch (error) {
      console.error('일일 사용량 증가 오류:', error);
      return 0;
    }
  },

  async getDailyUsage(userId) {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_usage:${userId}:${today}`;
    try {
      const count = await redis.get(key);
      return parseInt(count) || 0;
    } catch (error) {
      console.error('일일 사용량 조회 오류:', error);
      return 0;
    }
  }
};

export default redis;
