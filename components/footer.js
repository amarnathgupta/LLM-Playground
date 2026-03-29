document.getElementById("footer").innerHTML = `
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-10">
    <div class="px-6 py-4 flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-600">
      <span>🧠 LLM Playground</span>
      <div class="flex items-center gap-4">
        <span>Built to learn how LLMs work</span>
        <button
          onclick="toggleTheme()"
          class="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <span id="theme-icon">🌙</span>
        </button>
      </div>
    </div>
  </footer>
`;

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("theme-icon").textContent = isDark ? "☀️" : "🌙";
}

// Page load pe saved theme apply karo
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add("dark");
  document.getElementById("theme-icon").textContent = "☀️";
}
