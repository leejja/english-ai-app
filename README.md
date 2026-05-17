# AI English Learning Assistant

AI 기반 영어 학습 웹앱입니다.

사용자는 다양한 영어 학습 기능을 통해:
- 상황별 영어회화
- 영어 문장 첨삭
- 여행 영어 표현 생성
- 영어 퀴즈

등을 AI와 함께 연습할 수 있습니다.

---

# 주요 기능

## 1. 상황별 영어회화
사용자가 원하는 상황을 입력하면 AI가 영어 역할극을 진행합니다.

예:
- 카페 주문
- 공항
- 호텔
- 여행
- 회사

---

## 2. 영어 문장 첨삭
사용자가 작성한 영어 문장을:
- 문법
- 자연스러운 표현
- 원어민 표현

형태로 교정합니다.

---

## 3. 여행 영어 생성
한국어로 입력하면 실제 여행 상황에서 사용할 수 있는 영어 표현을 제공합니다.

---

## 4. 영어 퀴즈
AI가 사용자 수준에 맞는 영어 퀴즈를 생성합니다.

---

# 사용 기술

## Frontend
- HTML
- CSS
- JavaScript

## Backend
- Netlify Functions

## AI
- OpenAI API (gpt-4o-mini)

## Deployment
- Netlify

## Version Control
- GitHub

---

# 프로젝트 구조

```text
english-ai-app/
├── index.html
├── style.css
├── script.js
└── netlify/
    └── functions/
        └── chat.js
```

---

# 개발 과정

## 1단계
기본 HTML 화면 구성

- 메뉴 UI 생성
- 입력창 및 결과창 생성

---

## 2단계
메뉴 전환 기능 구현

JavaScript를 이용하여:
- 상황별 회화
- 문장 첨삭
- 여행 영어
- 영어 퀴즈

모드를 전환할 수 있도록 구현

---

## 3단계
Netlify Functions 연결

`chat.js`를 생성하여:
- 사용자 입력 수신
- OpenAI API 요청
- AI 응답 반환

구현

---

## 4단계
OpenAI API 연동

OpenAI API Key를 Netlify Environment Variables에 등록하여 보안 처리

사용 모델:
- gpt-4o-mini

---

## 5단계
GitHub 연동 및 자동 배포

- GitHub Repository 생성
- Netlify와 GitHub 연결
- git push 시 자동 배포 구성

---

## 6단계
기본 스타일링 적용

- 반응형 UI
- 모바일 대응
- 카드형 디자인
- 버튼 스타일 적용

---

## 7단계
채팅 스타일 UI 구현

- 사용자 말풍선
- AI 말풍선
- 채팅형 인터페이스 구현

---

# 실행 방법

## 1. 프로젝트 클론

```bash
git clone 저장소주소
```

---

## 2. 의존성 없음
별도의 npm 설치 없이 실행 가능

---

## 3. OpenAI API Key 등록

Netlify 환경변수:

```text
OPENAI_API_KEY
```

추가 필요

---

# 배포 주소

Netlify를 통해 배포

```text
배포주소 입력
```

---

# 향후 개발 예정

- 대화 이어가기 기능
- 음성 입력(STT)
- 음성 출력(TTS)
- 영어 일기 첨삭
- 학습 기록 저장
- 로그인 기능
- 아이 영어 모드
- PWA 앱화

---

# License

MIT License
