const COLORS = [
  "token-0",
  "token-1",
  "token-2",
  "token-3",
  "token-4",
  "token-5",
];

const modelMap = {
  o200k_base: "Xenova/gpt-4o",
  cl100k_base: "Xenova/gpt-4",
  p50k_base: "Xenova/text-davinci-003",

  bert: "Xenova/bert-base-uncased",
  distilbert: "Xenova/distilbert-base-uncased",
  miniLM: "Xenova/all-MiniLM-L6-v2",
  t5_small: "Xenova/t5-small",
  roberta: "Xenova/roberta-base",
};

let tokenizer = null;
let loading = false;

async function loadTokenizer(modelKey) {
  if (loading) return;
  loading = true;
  document.getElementById("token-display").innerHTML =
    '<span class="text-xs text-neutral-400">Loading tokenizer...</span>';

  const { AutoTokenizer } =
    await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js");

  tokenizer = await AutoTokenizer.from_pretrained(modelMap[modelKey]);
  loading = false;
  tokenize();
}

async function tokenize() {
  if (!tokenizer) return;
  const text = document.getElementById("input-text").value;
  if (!text.trim()) {
    document.getElementById("token-display").innerHTML = "";
    document.getElementById("token-ids").innerHTML = "";
    updateStats(0, 0);
    return;
  }

  const { input_ids } = await tokenizer(text, { add_special_tokens: false });
  const ids = Array.from(input_ids.data);
  const tokens = ids.map((id) =>
    tokenizer.decode([id], { skip_special_tokens: true }),
  );

  renderTokens(tokens, ids);
  updateStats(tokens.length, text.length);
}

function renderTokens(tokens, ids) {
  const display = document.getElementById("token-display");
  const idsEl = document.getElementById("token-ids");

  display.innerHTML = tokens
    .map((t, i) => {
      const color = COLORS[i % COLORS.length];
      const label = (t || "?").replace(/ /g, "·").replace(/\n/g, "↵");
      return `<span class="inline-block border rounded px-2 py-1 text-xs font-mono font-medium ${color}">${label}</span>`;
    })
    .join("");

  idsEl.innerHTML = ids
    .map((id, i) => {
      const color = COLORS[i % COLORS.length];
      return `<span class="border rounded px-1.5 py-0.5 ${color}">${id}</span>`;
    })
    .join("");

  document.getElementById("token-count-badge").textContent =
    `${tokens.length} token${tokens.length !== 1 ? "s" : ""}`;
}

function updateStats(tokens, chars) {
  document.getElementById("stat-tokens").textContent = tokens;
  document.getElementById("stat-chars").textContent = chars;
  document.getElementById("stat-ratio").textContent = tokens
    ? (chars / tokens).toFixed(1)
    : "0";
}

window.setExample = function (text) {
  document.getElementById("input-text").value = text;
  tokenize();
};

document.getElementById("input-text").addEventListener("input", tokenize);

const defaultModel = createModelSelector((key) => loadTokenizer(key));
loadTokenizer(defaultModel);
