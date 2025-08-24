import { body, validationResult } from 'express-validator';

// 검증 결과 처리 미들웨어
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: '입력 데이터가 올바르지 않습니다.',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// 회원가입 검증 규칙
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('사용자명은 2-20자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9가-힣_]+$/)
    .withMessage('사용자명은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage('비밀번호는 영문과 숫자를 포함해야 합니다.'),
  
  body('birthDate')
    .optional()
    .isISO8601()
    .withMessage('올바른 생년월일을 입력해주세요.'),
  
  handleValidationErrors
];

// 로그인 검증 규칙
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  
  body('password')
    .notEmpty()
    .withMessage('비밀번호를 입력해주세요.'),
  
  handleValidationErrors
];

// 타로 상담 검증 규칙
export const validateTarotReading = [
  body('question')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('질문은 5-500자 사이여야 합니다.'),
  
  body('spreadType')
    .isIn(['one_card', 'three_card', 'love'])
    .withMessage('올바른 스프레드 타입을 선택해주세요.'),
  
  handleValidationErrors
];

// 프로필 업데이트 검증 규칙
export const validateProfileUpdate = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('사용자명은 2-20자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9가-힣_]+$/)
    .withMessage('사용자명은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  
  body('birthDate')
    .optional()
    .isISO8601()
    .withMessage('올바른 생년월일을 입력해주세요.'),
  
  handleValidationErrors
];

// 피드백 검증 규칙
export const validateFeedback = [
  body('sessionId')
    .isInt({ min: 1 })
    .withMessage('올바른 세션 ID를 입력해주세요.'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('평점은 1-5 사이의 숫자여야 합니다.'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('코멘트는 1000자 이하여야 합니다.'),
  
  handleValidationErrors
];

// 페이지네이션 검증 규칙
export const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상이어야 합니다.'),
  
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('페이지당 항목 수는 1-100 사이여야 합니다.'),
  
  handleValidationErrors
];

// 이메일 중복 확인 검증
export const validateEmailCheck = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.'),
  
  handleValidationErrors
];

// 사용자명 중복 확인 검증
export const validateUsernameCheck = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('사용자명은 2-20자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9가-힣_]+$/)
    .withMessage('사용자명은 영문, 숫자, 한글, 언더스코어만 사용 가능합니다.'),
  
  handleValidationErrors
];
