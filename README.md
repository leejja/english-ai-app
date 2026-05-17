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

## 3단계. Netlify Functions 연결

OpenAI API Key를 프론트엔드 코드에 직접 넣으면 보안상 위험하기 때문에, Netlify Functions를 사용하여 서버 쪽에서 OpenAI API를 호출하도록 구성했다.

### 폴더 구조

```text
english-ai-app/
├── index.html
├── style.css
├── script.js
└── netlify/
    └── functions/
        └── chat.js
```

### 동작 흐름

```text
사용자 입력
→ script.js에서 /.netlify/functions/chat 호출
→ netlify/functions/chat.js 실행
→ OpenAI API 요청
→ AI 응답을 프론트엔드로 반환
→ 화면에 출력
```

### 프론트엔드 요청 예시

```js
const response = await fetch("/.netlify/functions/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    mode: currentMode,
    message: message
  })
});
```

### Netlify Function 역할

`chat.js`에서는 다음 작업을 수행한다.

```text
1. POST 요청 확인
2. 사용자 입력값 확인
3. 메뉴 모드별 프롬프트 선택
4. OpenAI API 호출
5. AI 응답 텍스트 추출
6. JSON 형태로 프론트엔드에 반환
```

---

## 4단계. OpenAI API 연동

AI 응답 생성을 위해 OpenAI API를 사용했다.

### API Key 발급

OpenAI Platform에서 API Key를 발급한다.

```text
OpenAI Platform
→ API keys
→ Create new secret key
```

생성된 키는 `sk-...` 형태이며, 한 번만 전체 확인이 가능하므로 생성 직후 복사해야 한다.

### 결제 설정

OpenAI API는 ChatGPT Plus와 별도이며, API 사용을 위해 Billing 설정이 필요하다.

```text
OpenAI Platform
→ Billing
→ Start billing plan
→ 결제수단 등록
→ Prepaid credit 충전
```

초기 개발 테스트용으로는 소액 충전 후 Auto recharge는 꺼두고 시작했다.

### Netlify 환경변수 등록

API Key는 코드에 직접 작성하지 않고 Netlify Environment Variables에 등록했다.

```text
Netlify
→ Site configuration
→ Environment variables
→ Add a variable
```

등록값:

```text
Key: OPENAI_API_KEY
Value: OpenAI에서 발급받은 API Key
```

### Function에서 환경변수 사용

```js
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
```

### 사용 모델

초기 MVP에서는 비용과 속도를 고려하여 다음 모델을 사용했다.

```text
gpt-4o-mini
```

### 응답 파싱 처리

OpenAI 응답 구조에 따라 `output_text`가 비어 있을 수 있어, `data.output` 내부의 텍스트도 함께 확인하도록 처리했다.

```js
let answer = data.output_text;

if (!answer && data.output && Array.isArray(data.output)) {
  for (const item of data.output) {
    if (item.content && Array.isArray(item.content)) {
      for (const content of item.content) {
        if (content.text) {
          answer = content.text;
          break;
        }
        if (content.type === "output_text" && content.text) {
          answer = content.text;
          break;
        }
      }
    }
    if (answer) break;
  }
}
```

---

## 5단계. GitHub 연동 및 자동 배포

프로젝트 관리를 위해 GitHub 저장소를 생성하고, Netlify와 연결하여 자동 배포 환경을 구성했다.

### Git 초기화

VS Code 터미널에서 프로젝트 폴더 기준으로 실행했다.

```bash
git init
```

### 변경 파일 추가

```bash
git add .
```

### 첫 커밋 생성

```bash
git commit -m "first commit"
```

### 기본 브랜치 설정

```bash
git branch -M master
```

### GitHub 저장소 연결

GitHub에서 새 Repository를 생성한 뒤, 저장소 주소를 remote로 연결했다.

```bash
git remote add origin https://github.com/사용자명/저장소명.git
```

### GitHub에 업로드

```bash
git push -u origin master
```

### Netlify와 GitHub 연결

Netlify에서 GitHub 저장소를 연결했다.

```text
Netlify
→ Add new site
→ Import from Git
→ GitHub 선택
→ Repository 선택
→ Deploy site
```

### 자동 배포 흐름

이후부터는 VS Code에서 코드를 수정한 뒤 아래 명령어만 실행하면 Netlify가 자동으로 재배포된다.

```bash
git add .
git commit -m "update project"
git push
```

자동 배포 흐름:

```text
VS Code 수정
→ git push
→ GitHub 저장소 업데이트
→ Netlify가 변경 감지
→ 자동 Build/Deploy
→ 배포 사이트에 반영
```

### 배포 확인

Netlify의 `Deploys` 메뉴에서 배포 상태를 확인할 수 있다.

```text
Deploys
→ Building
→ Published
```

`Published` 상태가 되면 최신 코드가 실제 웹앱에 반영된 것이다.

### 환경변수 변경 후 재배포

OpenAI API Key 같은 환경변수를 새로 추가하거나 수정한 경우에는 재배포가 필요하다.

```text
Netlify
→ Deploys
→ Trigger deploy
→ Deploy site
```
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
