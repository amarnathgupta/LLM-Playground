# 🧠 LLM Playground

An interactive playground to learn how LLMs work — built with vanilla JS + Node.js.

## Pages

- **Home** — Overview of how LLMs are built
- **Tokenizer** — Visualize how text is broken into tokens (uses real tiktoken)
- **Chatbot** — Chat with Gemini with tunable parameters

## Setup

1. Clone the repo
   git clone https://github.com/yourusername/llm-playground.git
   cd llm-playground

2. Install dependencies
   npm install

3. Add your Gemini API key
   cp .env.example .env

   # .env file mein apni key daalo

4. Run
   npm start

5. Open http://localhost:3000

## Get your free Gemini API key

https://aistudio.google.com/apikey

## Built with

- Vanilla JS + Tailwind CSS v4
- Node.js + Express
- Google Gemini API (@google/genai)
- Tiktoken (via @xenova/transformers)
