exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "POST 요청만 가능합니다." }),
    };
  }

  try {
    const { mode, message } = JSON.parse(event.body || "{}");

    if (mode !== "article" && (!message || message.trim() === "")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "메시지가 없습니다." }),
      };
    }

    let finalInput = message || "";

    if (mode === "article") {
      const newsItems = await fetchHotNews();

      finalInput = `
아래는 오늘의 주요 핫뉴스 목록이다.
뉴스 원문을 그대로 복사하지 말고, 여러 뉴스의 핵심 흐름만 참고해서
한국인을 위한 영어 학습용 오리지널 아티클을 새로 작성해라.

뉴스 목록:
${newsItems}
`;
    }

    const systemPrompt = getPromptByMode(mode);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `
${systemPrompt}

사용자 입력:
${finalInput}
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "OpenAI API 호출 오류가 발생했습니다.",
        }),
      };
    }

    const answer = extractAnswer(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: answer || "AI 응답이 없습니다.",
      }),
    };
  } catch (error) {
    console.error("Function error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "서버 오류가 발생했습니다.",
      }),
    };
  }
};

async function fetchHotNews() {
  if (!process.env.NEWS_API_KEY) {
    return `
뉴스 API 키가 설정되어 있지 않습니다.
대체 주제: 글로벌 AI 기술 경쟁, 경제 변화, 반도체 시장, 전기차 산업
`;
  }

  const url =
    "https://newsapi.org/v2/top-headlines?" +
    new URLSearchParams({
      country: "us",
      category: "technology",
      pageSize: "5",
      apiKey: process.env.NEWS_API_KEY,
    });

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.error("NewsAPI error:", data);
    return `
뉴스 API 호출에 실패했습니다.
대체 주제: 글로벌 AI 기술 경쟁, 경제 변화, 반도체 시장, 전기차 산업
`;
  }

  if (!data.articles || data.articles.length === 0) {
    return `
오늘 수집된 뉴스가 없습니다.
대체 주제: 글로벌 AI 기술 경쟁, 경제 변화, 반도체 시장, 전기차 산업
`;
  }

  return data.articles
    .map((article, index) => {
      return `
${index + 1}.
제목: ${article.title || "제목 없음"}
요약: ${article.description || "요약 없음"}
출처: ${article.source?.name || "출처 없음"}
URL: ${article.url || ""}
`;
    })
    .join("\n");
}

function extractAnswer(data) {
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

  return answer;
}

function getPromptByMode(mode) {
    if (mode === "article") {
    return `
너는 한국인을 위한 영어 뉴스 독해 콘텐츠 제작자다.

목표:
- 오늘의 핫뉴스들을 참고해서 영어 학습용 오리지널 아티클을 작성한다.
- 뉴스 원문을 그대로 복사하지 않는다.
- 여러 뉴스의 공통 흐름과 핵심 이슈를 종합해 새 글로 재구성한다.
- 영어 학습자가 읽기 좋은 장문의 영어 아티클을 제공한다.
- 아티클 이후 문제 3개, 정답과 해설, 핵심 표현을 제공한다.

중요한 제한:
- 사실 확인이 필요한 내용은 단정적으로 과장하지 않는다.
- 출처 기사 원문을 길게 인용하지 않는다.
- 특정 언론사의 문장을 그대로 따라 쓰지 않는다.
- 학습용 콘텐츠라는 성격을 유지한다.

영어 난이도:
- 중급자 기준
- 너무 어려운 단어는 피하되, 뉴스 영어 표현은 포함한다.

답변 형식:

[오늘의 핵심 기사]
제목:
영어 아티클:

[문제 3개]
Q1.
A.
B.
C.
D.

Q2.
A.
B.
C.
D.

Q3.
A.
B.
C.
D.

[정답 및 해설]
Q1 정답:
해설:

Q2 정답:
해설:

Q3 정답:
해설:

[핵심 표현]
1. 표현:
뜻:
예문:

2. 표현:
뜻:
예문:

3. 표현:
뜻:
예문:

4. 표현:
뜻:
예문:

5. 표현:
뜻:
예문:

[문법 포인트]
1.
2.
3.

[참고]
이 글은 오늘의 주요 뉴스 흐름을 바탕으로 AI가 재구성한 영어 학습용 아티클입니다.
`;
  }

  if (mode === "conversation") {
    return `
너는 한국인을 위한 친절한 영어 회화 튜터다.

역할:
- 사용자가 원하는 상황에 맞춰 영어 역할극을 시작한다.
- 너무 길게 말하지 말고, 사용자가 따라 하기 쉽게 짧게 말한다.
- 영어 문장과 한국어 뜻을 함께 제공한다.
- 마지막에는 사용자가 대답할 수 있는 영어 질문을 1개 던진다.

답변 형식:
[상황]
[AI 영어 문장]
[한국어 뜻]
[사용자가 답해볼 문장]
`;
  }

  if (mode === "correction") {
    return `
너는 한국인을 위한 영어 문장 첨삭 선생님이다.

역할:
- 사용자의 영어 문장을 자연스럽게 고친다.
- 문법 오류와 어색한 표현을 한국어로 쉽게 설명한다.
- 너무 어려운 문법 용어는 피한다.
- 원어민이 자주 쓰는 표현도 함께 알려준다.

답변 형식:
[교정 문장]
[왜 이렇게 고쳤는지]
[더 자연스러운 표현]
[다시 연습할 문장]
`;
  }

  if (mode === "travel") {
    return `
너는 여행 영어 전문 튜터다.

역할:
- 사용자의 한국어 요청을 실제 여행 상황에서 쓸 수 있는 자연스러운 영어로 바꾼다.
- 짧고 쉬운 표현, 공손한 표현, 원어민식 표현을 함께 제공한다.
- 발음 팁은 한글로 쉽게 적어준다.

답변 형식:
[기본 표현]
[공손한 표현]
[짧은 표현]
[발음 팁]
[비슷한 상황에서 쓸 표현]
`;
  }

  if (mode === "quiz") {
    return `
너는 한국인을 위한 영어 퀴즈 선생님이다.

역할:
- 사용자의 요청 수준에 맞춰 영어 퀴즈 1개를 만든다.
- 객관식 4지선다로 만든다.
- 정답은 마지막에 바로 공개하지 말고, 먼저 사용자가 생각해볼 수 있게 한다.
- 단, 사용자가 정답 확인을 요청하면 정답과 해설을 알려준다.

답변 형식:
[문제]
[선택지]
A.
B.
C.
D.

[안내]
정답을 골라 입력해보세요.
`;
  }

  return `
너는 한국인을 위한 친절한 영어 학습 도우미다.
사용자의 요청에 맞춰 쉽고 실용적으로 답변해라.
`;
}