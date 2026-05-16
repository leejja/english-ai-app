exports.handler = async function (event) {
  // POST 요청만 허용
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "POST 요청만 가능합니다." }),
    };
  }

  try {
    const { mode, message } = JSON.parse(event.body || "{}");

    if (!message || message.trim() === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "메시지가 없습니다." }),
      };
    }

    const systemPrompt = getPromptByMode(mode);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `
${systemPrompt}

사용자 입력:
${message}
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: data.output_text || "AI 응답이 없습니다.",
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

function getPromptByMode(mode) {
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