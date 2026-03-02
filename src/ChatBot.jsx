import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import "./Chatbot.css";

function Chatbot({ messages, isLoading }) {
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-messages-container" ref={chatMessagesRef}>
      {messages.map((chatMessage) => (
        <ChatMessage
          message={chatMessage.message}
          sender={chatMessage.sender}
          key={chatMessage.id}
        />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
}

export default Chatbot;
