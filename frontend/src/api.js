// ============================================================
// Frontend API helper – talks to the Express backend
// ============================================================
const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Auth
export async function register(username, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return request("/auth/me");
}

// Chat history
export async function getChats() {
  const data = await request("/chat");
  return data.conversations || [];
}

export async function getChat(chatId) {
  const data = await request(`/chat/${chatId}`);
  return data.conversation;
}

// Chat – send message (creates or continues a conversation)
export async function sendChatMessage(message, chatId) {
  const data = await request("/chat", {
    method: "POST",
    body: JSON.stringify({ message, chatId }),
  });
  return data; // { reply, chatId }
}
