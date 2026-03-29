const currentPath = window.location.pathname
  .split("/")
  .pop()
  .replace(".html", "");

const links = [
  { href: "index", label: "Home" },
  { href: "tokenizer", label: "Tokenizer" },
  { href: "chatbot", label: "Chatbot" },
];

const navLinks = links
  .map((link) => {
    const isActive = currentPath === link.href;
    return `
      <a
        class="px-3 py-1.5 rounded-md transition-colors ${
          isActive
            ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold"
            : "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 text-neutral-500 dark:text-neutral-400"
        }"
        href="${link.href}.html"
      >${link.label}</a>
    `;
  })
  .join("");

document.getElementById("navbar").innerHTML = `
  <nav class="flex gap-4 justify-start items-center w-full px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm">
    <div class="font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-100 pr-4 border-r border-neutral-200 dark:border-neutral-800">
      🧠 LLM Playground
    </div>
    <div class="flex gap-1 font-medium items-center flex-1 text-sm text-neutral-500">
      ${navLinks}
    </div>
  </nav>
`;
