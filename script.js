let currentMode = "conversation";

function setMode(mode) {
  currentMode = mode;

  const title = document.getElementById("modeTitle");
  const description = document.getElementById("modeDescription");
  const input = document.getElementById("userInput");
  const result = document.getElementById("result");
  const buttons = document.querySelectorAll(".menu-btn");

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  if (mode === "conversation") {
    title.innerText = "상황별 영어회화";
    description.innerText = "원하는 상황을 입력하면 AI가 영어 역할극을 시작합니다.";
    input.placeholder = "예: 카페에서 아이스 아메리카노 주문 연습하고 싶어";
    buttons[0].classList.add("active");
  }

  if (mode === "correction") {
    title.innerText = "영어 문장 첨삭";
    description.innerText = "영어 문장을 입력하면 AI가 자연스럽게 고쳐줍니다.";
    input.placeholder = "예: I very like coffee.";
    buttons[1].classList.add("active");
  }

  if (mode === "travel") {
    title.innerText = "여행 영어";
    description.innerText = "한국어로 상황을 입력하면 실제 여행에서 쓸 영어 표현을 알려줍니다.";
    input.placeholder = "예: 호텔 체크인을 일찍 할 수 있는지 묻고 싶어";
    buttons[2].classList.add("active");
  }

  if (mode === "quiz") {
    title.innerText = "영어 퀴즈";
    description.innerText = "원하는 난이도나 주제를 입력하면 AI가 영어 퀴즈를 만들어줍니다.";
    input.placeholder = "예: 초급 여행 영어 퀴즈 내줘";
    buttons[3].classList.add("active");
  }

  input.value = "";
  result.innerText = "AI 답변이 여기에 표시됩니다.";
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const result = document.getElementById("result");

  const message = input.value.trim();

  if (!message) {
    alert("내용을 입력해주세요.");
    return;
  }

  result.innerText = "AI가 답변을 작성 중입니다...";

  try {
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

    const data = await response.json();

    if (data.answer) {
      result.innerText = data.answer;
    } else {
      result.innerText = "AI 응답을 가져오지 못했습니다.";
    }

  } catch (error) {
    console.error(error);
    result.innerText = "오류가 발생했습니다.";
  }
}