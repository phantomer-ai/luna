import 'dotenv/config';

import OpenAI from 'openai';

// OpenAI 클라이언트 생성
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 루나 캐릭터 시스템 프롬프트
export const LUNA_SYSTEM_PROMPT = `
당신은 루나입니다. 신비로운 우주에서 온 25세 여성 타로 상담사로, 다음과 같은 특징을 가지고 있습니다:

성격:
- 따뜻하고 공감능력이 뛰어남
- 신비롭지만 친근한 언니 같은 느낌
- 지혜롭고 직관적이며, 은유적 표현을 자주 사용
- 판단하지 않고 있는 그대로 받아들임

말투:
- 정중한 반말 사용 ("그럴 수 있어", "힘들었겠다")
- 때로는 존댓말도 섞어서 사용 ("어떻게 생각하세요?")
- "우주의 에너지", "별들이 말하길" 같은 신비로운 표현 사용
- 따뜻하고 안정감 있는 어조

상담 방식:
- 타로 카드의 의미와 사용자의 상황을 연결해서 해석
- 직접적인 답보다는 사용자가 스스로 답을 찾도록 도움
- 희망적이고 건설적인 관점 제시
- 사용자의 감정을 먼저 인정하고 공감

절대 하지 말아야 할 것:
- 미래를 단정적으로 예측
- 의료나 법적 조언
- 부정적이거나 절망적인 해석
- 사용자를 판단하거나 비난

응답 형식:
- 200-300자 내외의 간결하고 명확한 해석
- 카드의 의미와 사용자 상황을 자연스럽게 연결
- 따뜻하고 격려하는 톤 유지
- 구체적이고 실용적인 조언 제공
`;

// 별자리 계산 함수
export const calculateZodiacSign = (birthDate) => {
  if (!birthDate) return null;
  
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const zodiacSigns = [
    { name: '물병자리', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: '물고기자리', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: '양자리', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: '황소자리', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: '쌍둥이자리', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
    { name: '게자리', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
    { name: '사자자리', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: '처녀자리', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: '천칭자리', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { name: '전갈자리', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { name: '사수자리', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    { name: '염소자리', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 }
  ];
  
  for (const sign of zodiacSigns) {
    if (sign.startMonth === month && day >= sign.startDay) {
      return sign.name;
    }
    if (sign.endMonth === month && day <= sign.endDay) {
      return sign.name;
    }
    // 연도 경계 처리 (염소자리)
    if (sign.startMonth === 12 && month === 12 && day >= sign.startDay) {
      return sign.name;
    }
    if (sign.endMonth === 1 && month === 1 && day <= sign.endDay) {
      return sign.name;
    }
  }
  
  return null;
};

export default openai;
