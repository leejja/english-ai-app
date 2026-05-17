let currentMode = "article";

function setMode(mode) {
  currentMode = mode;

  const title = document.getElementById("modeTitle");
  const description = document.getElementById("modeDescription");
  const input = document.getElementById("userInput");

  const buttons = document.querySelectorAll(".menu-btn");

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  if (mode === "article") {
    title.innerText = "오늘의 핵심 기사";
    description.innerText =
      "AI가 오늘의 핫뉴스를 수집해 영어 학습용 아티클과 문제를 생성합니다.";

    input.placeholder =
      "입력 없이 바로 AI에게 보내기를 눌러보세요.";

    buttons[0].classList.add("active");
  }

  if (mode === "conversation") {
    title.innerText = "상황별 영어회화";

    description.innerText =
      "원하는 상황을 입력하면 AI가 영어 역할극을 시작합니다.";

    input.placeholder =
      "예: 카페에서 아이스 아메리카노 주문 연습하고 싶어";

    buttons[1].classList.add("active");
  }

  if (mode === "correction") {
    title.innerText = "영어 문장 첨삭";

    description.innerText =
      "영어 문장을 입력하면 AI가 자연스럽게 고쳐줍니다.";

    input.placeholder =
      "예: I very like coffee.";

    buttons[2].classList.add("active");
  }

  if (mode === "travel") {
    title.innerText = "여행 영어";

    description.innerText =
      "한국어로 상황을 입력하면 실제 여행에서 쓸 영어 표현을 알려줍니다.";

    input.placeholder =
      "예: 호텔 체크인을 일찍 할 수 있는지 묻고 싶어";

    buttons[3].classList.add("active");
  }

  if (mode === "quiz") {
    title.innerText = "영어 퀴즈";

    description.innerText =
      "원하는 난이도나 주제를 입력하면 AI가 영어 퀴즈를 만들어줍니다.";

    input.placeholder =
      "예: 초급 여행 영어 퀴즈 내줘";

    buttons[4].classList.add("active");
  }

  input.value = "";
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  const message = input.value.trim();

  if (!message && currentMode !== "article") {
    alert("내용을 입력해주세요.");
    return;
  }

  addMessage(message, "user");
  input.value = "";

  const loadingMessage = addLoadingMessage();

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

    if (!response.ok) {
      loadingMessage.classList.remove("loading-message");
      loadingMessage.innerText = data.error || "서버 오류가 발생했습니다.";
      return;
    }

    loadingMessage.classList.remove("loading-message");
    loadingMessage.innerText = data.answer || "AI 응답이 없습니다.";
  } catch (error) {
    console.error(error);
    loadingMessage.innerText = "오류가 발생했습니다.";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chatBox");

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (sender === "user") {
    messageDiv.classList.add("user-message");
  } else {
    messageDiv.classList.add("ai-message");
  }

  messageDiv.innerText = text;
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  return messageDiv;
}

function addLoadingMessage() {
  const chatBox = document.getElementById("chatBox");

  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "ai-message", "loading-message");

  loadingDiv.innerHTML = `
    <div class="typing">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  chatBox.appendChild(loadingDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  return loadingDiv;
}