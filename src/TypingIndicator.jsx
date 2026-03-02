import robot from "./assets/robot.svg";
import "./TypingIndicator.css";

function TypingIndicator() {
  return (
    <div className="typing-indicator-container">
      <img src={robot} alt="" width="50" className="message-container-robot" />
      <div className="typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export default TypingIndicator;
