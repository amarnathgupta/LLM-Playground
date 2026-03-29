const models = [
  // 🔥 Chat models
  { key: "o200k_base", label: "GPT-4o / GPT-4o mini", default: true },
  { key: "cl100k_base", label: "GPT-4 / GPT-3.5" },
  { key: "p50k_base", label: "GPT-3 (davinci)" },

  // 🧠 NLP models
  { key: "bert", label: "BERT (bert-base-uncased)" },
  { key: "distilbert", label: "DistilBERT (fast)" },

  // ⚡ Lightweight
  { key: "miniLM", label: "MiniLM (very fast)" },

  // 🔤 Encoder-decoder
  { key: "t5_small", label: "T5 Small" },

  // 🧪 Experimental
  { key: "roberta", label: "RoBERTa Base" },
];

function createModelSelector(onSelect) {
  const wrapper = document.getElementById("model-selector");

  const defaultModel = models.find((m) => m.default) || models[0];

  // Dropdown HTML
  wrapper.innerHTML = `
    <select id="model-dropdown" class="model-dropdown bg-white text-neutral-900 border-neutral-300
         dark:bg-neutral-900 dark:text-white dark:border-neutral-600
         border rounded px-3 py-2 text-sm">
      ${models
        .map(
          (model) => `
        <option value="${model.key}" ${
          model.key === defaultModel.key ? "selected" : ""
        }>
          ${model.label}
        </option>
      `,
        )
        .join("")}
    </select>
  `;

  const dropdown = document.getElementById("model-dropdown");

  // Change event
  dropdown.addEventListener("change", (e) => {
    onSelect(e.target.value);
  });

  return defaultModel.key;
}
