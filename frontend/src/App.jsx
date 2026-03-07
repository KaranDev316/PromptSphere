import { useEffect, useState } from "react";
import Chatbot from "./ChatBot";
import ChatInput from "./ChatInput";
import AuthForm from "./AuthForm";
import { getMe, getChats, getChat } from "./api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthChecked(true);
      return;
    }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setAuthChecked(true));
  }, []);

  // Load chat history when user logs in
  useEffect(() => {
    if (!user) return;
    loadChats();
  }, [user]);

  async function loadChats() {
    try {
      const list = await getChats();
      setChats(list);
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  }

  async function handleSelectChat(chatId) {
    try {
      const conversation = await getChat(chatId);
      const mapped = (conversation.messages || []).map((m) => ({
        id: crypto.randomUUID(),
        sender: m.sender,
        message: m.content,
      }));
      setMessage(mapped);
      setActiveChatId(conversation._id);
    } catch (error) {
      console.error("Failed to load conversation", error);
    }
  }

  function handleNewChat() {
    setActiveChatId(null);
    setMessage([]);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setMessage([]);
    setChats([]);
    setActiveChatId(null);
  }

  if (!authChecked) return null; // brief loading

  if (!user) {
    return <AuthForm onAuth={setUser} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-user">Hi, {user.username}</div>
          <button className="new-chat-btn" onClick={handleNewChat}>
            + New chat
          </button>
        </div>
        <div className="sidebar-section-title">Chats</div>
        <ul className="chat-list">
          {chats.map((chat) => (
            <li
              key={chat._id}
              className={
                chat._id === activeChatId
                  ? "chat-list-item active"
                  : "chat-list-item"
              }
              onClick={() => handleSelectChat(chat._id)}
            >
              <div className="chat-list-title">{chat.title}</div>
              <div className="chat-list-meta">
                {new Date(chat.updatedAt).toLocaleString()}
              </div>
            </li>
          ))}
          {chats.length === 0 && (
            <li className="chat-list-empty">No chats yet – start a new one.</li>
          )}
        </ul>
        <button className="logout-btn sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="app-container">
        <header className="app-header">
          <span>{activeChatId ? "Conversation" : "New conversation"}</span>
        </header>
        <Chatbot messages={messages} isLoading={isLoading} />
        <ChatInput
          messages={messages}
          setMessage={setMessage}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onMessageSent={loadChats}
        />
      </div>
    </div>
  );
}

export default App;
