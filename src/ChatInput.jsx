import { useState } from "react";
import { getOpenAIResponse } from "./openai";
import "./ChatInput.css";

function ChatInput({ messages, setMessage, isLoading, setIsLoading }) {
  const [inputText, setInputText] = useState("");

  function handleMessage(event) {
    setInputText(event.target.value);
  }

  async function sendMessage() {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      message: trimmed,
      sender: "user",
      id: crypto.randomUUID(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessage(updatedMessages);
    setInputText("");
    setIsLoading(true);

    // Build conversation history for context
    const history = updatedMessages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.message,
    }));

    const reply = await getOpenAIResponse(trimmed, history.slice(0, -1));

    setMessage((prev) => [
      ...prev,
      {
        message: reply,
        sender: "robot",
        id: crypto.randomUUID(),
      },
    ]);

    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
    if (event.key === "Escape") {
      setInputText("");
    }
  }

  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        type="text"
        placeholder={isLoading ? "Waiting for reply…" : "Send a message to Chatbot"}
        onChange={handleMessage}
        value={inputText}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button onClick={sendMessage} className="send-btn" disabled={isLoading}>
        {isLoading ? "…" : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;
