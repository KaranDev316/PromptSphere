import Chatbot from "./ChatBot";
import ChatInput from "./ChatInput";
import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app-container">
      <Chatbot messages={messages} isLoading={isLoading} />
      <ChatInput
        messages={messages}
        setMessage={setMessage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

export default App;
