import openai, { LUNA_SYSTEM_PROMPT } from '../config/openai.js';
import pool from '../config/database.js';

// 루나의 타로 해석 생성
export const getLunaResponse = async (cards, question, userContext) => {
  try {
    const cardsDescription = cards.map((card, index) => {
      const direction = card.reversed ? ' (역방향)' : '';
      const meaning = card.reversed ? card.meaning_reversed : card.meaning_upright;
      return `${index + 1}. ${card.name}${direction}: ${meaning}`;
    }).join('\n');

    const userPrompt = `
사용자 질문: "${question}"

뽑힌 카드들:
${cardsDescription}

사용자 정보:
- 별자리: ${userContext.zodiacSign || '알 수 없음'}
- 이전 상담 요약: ${userContext.previousSessions || '첫 상담'}

이 타로 카드들을 바탕으로 루나의 목소리로 상담해주세요. 
카드의 의미와 사용자의 상황을 연결해서 따뜻하고 지혜로운 해석을 제공해주세요.
200-300자 내외로 간결하고 명확하게 답변해주세요.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: LUNA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // OpenAI API 오류 시 기본 해석 제공
    return generateFallbackResponse(cards, question);
  }
};

// 기본 해석 생성 (OpenAI API 오류 시)
const generateFallbackResponse = (cards, question) => {
  const cardNames = cards.map(card => 
    `${card.name}${card.reversed ? ' (역방향)' : ''}`
  ).join(', ');
  
  return `안녕하세요! 루나예요. 당신의 질문 "${question}"에 대해 ${cardNames} 카드들이 선택되었어요. 

이 카드들은 당신에게 중요한 메시지를 전하고 있어요. 각 카드의 의미를 깊이 생각해보시고, 당신의 상황과 연결지어 보세요. 

우주의 에너지가 당신을 안내하고 있으니, 마음의 소리에 귀 기울여보세요. 당신 안에 이미 답이 있을 거예요. ✨`;
};

// 사용자 컨텍스트 조회
export const getUserContext = async (userId) => {
  try {
    // 사용자 정보 조회
    const userResult = await pool.query(
      'SELECT zodiac_sign FROM users WHERE id = $1',
      [userId]
    );
    
    const user = userResult.rows[0];
    
    // 최근 상담 세션 조회 (최대 3개)
    const sessionsResult = await pool.query(
      `SELECT question, luna_interpretation, created_at 
       FROM tarot_sessions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 3`,
      [userId]
    );
    
    const previousSessions = sessionsResult.rows.map(session => 
      `질문: ${session.question} / 답변: ${session.luna_interpretation.substring(0, 100)}...`
    ).join('\n');
    
    return {
      zodiacSign: user?.zodiac_sign,
      previousSessions: previousSessions || '첫 상담'
    };
  } catch (error) {
    console.error('사용자 컨텍스트 조회 오류:', error);
    return {
      zodiacSign: null,
      previousSessions: '첫 상담'
    };
  }
};

// 사용자 메모리 업데이트
export const updateUserMemory = async (userId, question, cards) => {
  try {
    // 질문에서 키워드 추출
    const keywords = extractKeywords(question);
    
    // 카드 정보 저장
    const cardInfo = cards.map(card => ({
      name: card.name,
      reversed: card.reversed,
      suit: card.suit,
      keywords: card.keywords
    }));
    
    // 메모리 저장
    await pool.query(
      `INSERT INTO user_memory (user_id, memory_type, memory_key, memory_value, importance_score) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'question', 'recent_question', question, 5]
    );
    
    await pool.query(
      `INSERT INTO user_memory (user_id, memory_type, memory_key, memory_value, importance_score) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'cards', 'recent_cards', JSON.stringify(cardInfo), 4]
    );
    
    // 키워드별 메모리 저장
    for (const keyword of keywords) {
      await pool.query(
        `INSERT INTO user_memory (user_id, memory_type, memory_key, memory_value, importance_score) 
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, 'keyword', keyword, question, 3]
      );
    }
    
  } catch (error) {
    console.error('사용자 메모리 업데이트 오류:', error);
  }
};

// 질문에서 키워드 추출
const extractKeywords = (question) => {
  const keywords = [];
  
  // 감정 관련 키워드
  const emotionKeywords = ['사랑', '연애', '결혼', '이별', '우정', '가족', '직장', '일', '돈', '건강', '학업', '시험'];
  
  for (const keyword of emotionKeywords) {
    if (question.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  
  return keywords;
};

// 일일 사용량 체크
export const checkDailyUsage = async (userId, redisUtils) => {
  try {
    const dailyUsage = await redisUtils.getDailyUsage(userId);
    return dailyUsage;
  } catch (error) {
    console.error('일일 사용량 체크 오류:', error);
    return 0;
  }
};

// 일일 사용량 증가
export const incrementDailyUsage = async (userId, redisUtils) => {
  try {
    const newCount = await redisUtils.incrementDailyUsage(userId);
    return newCount;
  } catch (error) {
    console.error('일일 사용량 증가 오류:', error);
    return 0;
  }
};
