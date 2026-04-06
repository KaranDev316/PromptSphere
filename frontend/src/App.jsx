import { useEffect, useState } from "react";
import Chatbot from "./ChatBot";
import ChatInput from "./ChatInput";
import AuthForm from "./AuthForm";
import { getMe, getChats, getChat } from "./api";
import "./App.css";

const features = [
  {
    title: "Focused conversations",
    description: "A calm, uncluttered interface built for fast decisions and clear replies.",
    icon: "💬",
  },
  {
    title: "Secure sessions",
    description: "Private history management that keeps your workflow lightweight and safe.",
    icon: "🔒",
  },
  {
    title: "Instant access",
    description: "Sign in once and get started with smart, reliable AI conversation flow.",
    icon: "⚡",
  },
  {
    title: "Minimal control",
    description: "Precise interactions, smooth spacing, and high-contrast clarity across screens.",
    icon: "🧭",
  },
];

const testimonials = [
  {
    quote: "The interface feels premium and razor sharp — every interaction is calm and efficient.",
    name: "Amina K.",
    role: "Product Lead",
  },
  {
    quote: "A clean workspace that helps our team move quickly without distraction.",
    name: "Marcus T.",
    role: "Founder",
  },
  {
    quote: "The design is understated but powerful — even the smallest details feel intentional.",
    name: "Lena P.",
    role: "Creative Director",
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  if (!authChecked) return null;

  if (!user) {
    return <LandingPage onAuth={setUser} />;
  }

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
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

      {/* Main content */}
      <div className="app-container">
        <header className="app-header">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <span className="chat-title">{activeChatId ? "Conversation" : "New conversation"}</span>
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

function LandingPage({ onAuth }) {
  return (
    <div className="landing-shell">
      <div className="landing-nav-bar">
        <div className="landing-logo">PromptSphere</div>
        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#auth" className="nav-cta">
            Login
          </a>
        </nav>
      </div>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Minimal design for modern workflows</span>
          <h1>Elegant conversations, crafted for clarity.</h1>
          <p>
            A refined AI workspace with premium contrast, calm spacing, and instant access to meaningful answers.
          </p>
          <div className="hero-actions">
            <a href="#auth" className="btn btn-primary">
              Get Started
            </a>
            <a href="#features" className="btn btn-outline">
              Explore features
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-tag">Fast · Focused · Fluent</div>
            <div className="visual-title">AI conversations that feel effortless.</div>
            <div className="visual-meta">Modern, quiet, and built to help every message feel intentional.</div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-intro">
          <p className="section-label">Features</p>
          <h2>Designed for simplicity and control.</h2>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="about">
        <div className="split-copy">
          <p className="section-label">About</p>
          <h2>Focus on what matters with a sleek, distraction-free workspace.</h2>
          <p>
            The interface blends black, white, and soft grayscale to create strong hierarchy without noise. Designed to cut through clutter and keep your attention on every interaction.
          </p>
          <div className="split-list">
            <div>
              <strong>Clean structure</strong>
              <p>Soft borders, balanced whitespace, and a calm layout for every device.</p>
            </div>
            <div>
              <strong>High contrast</strong>
              <p>Clear typography and accessible visuals for premium readability.</p>
            </div>
          </div>
        </div>
        <div className="split-visual">
          <div className="visual-frame">
            <div className="visual-overlay" />
            <div className="visual-block" />
            <div className="visual-caption">Clarify your ideas with a quiet interface.</div>
          </div>
        </div>
      </section>

      <section className="testimonials-section" id="testimonials">
        <div className="section-intro">
          <p className="section-label">Testimonials</p>
          <h2>Feedback from teams who value fewer distractions.</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card">
              <div className="testimonial-avatar" aria-hidden="true">
                {item.name.charAt(0)}
              </div>
              <p className="testimonial-quote">“{item.quote}”</p>
              <p className="testimonial-author">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="auth-section" id="auth">
        <div className="auth-panel">
          <div className="auth-panel-copy">
            <p className="section-label">Get started</p>
            <h2>Access your workspace in seconds.</h2>
            <p>
              Sign in or create an account to start turning ideas into polished conversations.
            </p>
          </div>
          <div className="auth-panel-form">
            <AuthForm onAuth={onAuth} />
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#auth">Login</a>
        </div>
        <div className="footer-meta">
          <div className="social-set">
            <a href="#" aria-label="Twitter" className="social-icon">
              T
            </a>
            <a href="#" aria-label="LinkedIn" className="social-icon">
              L
            </a>
            <a href="#" aria-label="Dribbble" className="social-icon">
              D
            </a>
          </div>
          <p>© 2026 PromptSphere. Crafted for calm, elegant workflows.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
