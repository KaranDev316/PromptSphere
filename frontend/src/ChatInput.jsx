import { useState } from "react";
import { sendChatMessage } from "./api";
import "./ChatInput.css";

function ChatInput({
  messages,
  setMessage,
  isLoading,
  setIsLoading,
  activeChatId,
  setActiveChatId,
  onMessageSent,
}) {
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

    try {
      const { reply, chatId } = await sendChatMessage(trimmed, activeChatId);
      if (chatId && chatId !== activeChatId) {
        setActiveChatId(chatId);
      }
      setMessage((prev) => [
        ...prev,
        { message: reply, sender: "robot", id: crypto.randomUUID() },
      ]);
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      setMessage((prev) => [
        ...prev,
        {
          message: `⚠️ ${err.message}`,
          sender: "robot",
          id: crypto.randomUUID(),
        },
      ]);
    }

    setIsLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") sendMessage();
    if (event.key === "Escape") setInputText("");
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
