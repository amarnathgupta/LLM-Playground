const resizer = document.getElementById("resizer");
const leftPanel = document.getElementById("left-panel");

let isResizing = false;

resizer.addEventListener("mousedown", () => {
  isResizing = true;
  document.body.style.cursor = "col-resize";
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  document.body.style.userSelect = "none";
  const newWidth = e.clientX;

  // min / max limit
  if (newWidth < 200 || newWidth > 500) return;

  leftPanel.style.width = newWidth + "px";
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "default";
  document.body.style.userSelect = "";
  localStorage.setItem("panelWidth", leftPanel.style.width);
});

// Saved panel width restore karo on load
const savedWidth = localStorage.getItem("panelWidth");
if (savedWidth) leftPanel.style.width = savedWidth;

// -------------------------- Chatbot -----------------------------------

const messages = [];

function getParams() {
  return {
    systemPrompt: document.getElementById("system-prompt").value,
    temperature: parseFloat(document.getElementById("temperature").value),
    topP: parseFloat(document.getElementById("top-p").value),
    topK: parseInt(document.getElementById("top-k").value),
    freqPenalty: parseFloat(document.getElementById("freq-penalty").value),
    presPenalty: parseFloat(document.getElementById("pres-penalty").value),
    maxTokens: parseInt(document.getElementById("max-tokens").value),
  };
}

function resetParams() {
  document.getElementById("temperature").value = 0.7;
  document.getElementById("temperature-val").textContent = "0.70";
  document.getElementById("top-p").value = 0.9;
  document.getElementById("topp-val").textContent = "0.90";
  document.getElementById("top-k").value = 50;
  document.getElementById("topk-val").textContent = "50";
  document.getElementById("freq-penalty").value = 0;
  document.getElementById("freqpenalty-val").textContent = "0.00";
  document.getElementById("pres-penalty").value = 0;
  document.getElementById("prespenalty-val").textContent = "0.00";
  document.getElementById("max-tokens").value = 1024;
  document.getElementById("maxtokens-val").textContent = "1024";
}

function renderMessages() {
  const container = document.getElementById("chat-messages");
  const emptyState = document.getElementById("empty-state");

  if (messages.length === 0) {
    emptyState.style.display = "flex";
    return;
  }

  emptyState.style.display = "none";

  container.querySelectorAll(".msg-bubble").forEach((el) => el.remove());

  const html = messages
    .map((msg) => {
      if (msg.role === "user") {
        return `<div class="msg-bubble flex justify-end">
    <div class="max-w-[70%] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
      ${(msg.content || "").trim()}
    </div>
  </div>`;
      } else {
        return `<div class="msg-bubble flex justify-start gap-2.5">
    <div class="shrink-0 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm">🤖</div>
    <div class="max-w-[70%] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">${msg.content.trim()}</div>
  </div>`;
      }
    })
    .join("");

  container.insertAdjacentHTML("beforeend", html);
  container.scrollTop = container.scrollHeight;
}

window.sendMessage = async function (retryCount = 0) {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  messages.push({ role: "user", content: text });
  input.value = "";
  input.style.height = "auto";
  renderMessages();

  const container = document.getElementById("chat-messages");

  const thinking = document.createElement("div");
  thinking.id = "thinking";
  thinking.className = "flex justify-start gap-2.5";
  thinking.innerHTML = `
    <div class="shrink-0 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm">🤖</div>
    <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-neutral-400 dark:text-neutral-500">
      Thinking...
    </div>
  `;
  container.appendChild(thinking);
  container.scrollTop = container.scrollHeight;

  const params = getParams();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: params.systemPrompt
          ? [{ role: "system", content: params.systemPrompt }, ...messages]
          : messages,
        temperature: params.temperature,
        top_k: params.topK,
        top_p: params.topP,
        max_tokens: params.maxTokens,
        frequency_penalty: params.freqPenalty,
        presence_penalty: params.presPenalty,
      }),
    });

    const data = await res.json();

    if (!data || !data.reply) {
      throw new Error("Invalid response");
    }

    messages.push({
      role: "assistant",
      content: data.reply,
    });
  } catch (err) {
    console.error("Frontend Error:", err);

    // 🔁 Retry logic (max 2 times)
    if (retryCount < 2) {
      document.getElementById("thinking").innerHTML = `
        <div class="shrink-0 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm">🤖</div>
        <div class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-yellow-500">
          ⚠️ Model busy... retrying (${retryCount + 1}/2)
        </div>
      `;

      return setTimeout(() => {
        sendMessage(retryCount + 1);
      }, 2000);
    }

    messages.push({
      role: "assistant",
      content:
        "🚫 Model is busy right now (503).\n\n👉 Please try again after 5-10 sec.",
    });
  }

  document.getElementById("thinking")?.remove();
  renderMessages();
};

window.clearChat = function () {
  messages.length = 0;
  const container = document.getElementById("chat-messages");
  container.querySelectorAll(".msg-bubble").forEach((el) => el.remove());
  document.getElementById("empty-state").style.display = "flex";
};
