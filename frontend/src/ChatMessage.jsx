import user from "./assets/user.svg";
import robot from "./assets/robot.svg";
import './ChatMessage.css';

function ChatMessage({ message, sender }) {
  const isUser = sender === 'user';

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-ai'}`}>
      <div className="message-content">
        {!isUser && (
          <div className="message-avatar">
            <img src={robot} alt="AI" width="36" height="36" />
          </div>
        )}
        <div className="message-bubble">
          <div className="message-text">{message}</div>
        </div>
        {isUser && (
          <div className="message-avatar">
            <img src={user} alt="You" width="36" height="36" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
