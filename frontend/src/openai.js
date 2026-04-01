
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// You can change the model and system prompt to customise the bot.
const MODEL = "gpt-5-nano";
const SYSTEM_PROMPT =
  "You are a helpful and friendly chatbot assistant. Keep your answers concise.";

/**
 * Send a message to OpenAI and return the assistant's reply.
 *
 * @param {string} userMessage – The text the user typed.
 * @param {{ role: string, content: string }[]} [history] – Optional prior
 *   conversation turns so the model has context.
 * @returns {Promise<string>} The assistant's reply text.
 */
export async function getOpenAIResponse(userMessage, history = []) {
  if (!OPENAI_API_KEY) {
    return "⚠️ Please set your OpenAI API key in src/openai.js";
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("[OpenAI] API error:", error);
      return `⚠️ OpenAI error: ${error?.error?.message || response.statusText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "No response.";
  } catch (err) {
    console.error("[OpenAI] Network error:", err);
    return "⚠️ Network error – could not reach OpenAI.";
  }
}
