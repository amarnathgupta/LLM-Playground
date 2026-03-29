const cardsData = [
  {
    title: "Tokenizer",
    desc: "Break text into tokens and visualize how LLMs see your input",
    label: "Pre-training",
    href: "tokenizer",
  },
  {
    title: "Chat",
    desc: "Chat with an LLM using custom system and user prompts",
    label: "Inference",
    href: "chatbot",
  },
];

function createCard(card) {
  return `
    <a
      href="${card.href}.html"
      class="bg-white dark:bg-neutral-900 rounded-xl p-6 mb-4 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer"
    >
      <h2 class="font-semibold text-neutral-900 dark:text-neutral-100 text-base mb-1">${card.title}</h2>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-4">${card.desc}</p>
      <div class="flex justify-end w-full">
        <span class="text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2.5 py-1 rounded-full">${card.label}</span>
      </div>
    </a>
  `;
}

const cardContainer = document.getElementById("card-container");

cardsData.forEach((card) => {
  cardContainer.innerHTML += createCard(card);
});
