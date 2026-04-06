
const DEFAULT_PROD_API = "https://backend-ej3m.onrender.com";
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5001" : DEFAULT_PROD_API);

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Log outgoing request for debugging
  try {
    if (options && options.body) {
      console.log("API request:", `${API_BASE}${path}`, JSON.parse(options.body));
    } else {
      console.log("API request:", `${API_BASE}${path}`);
    }
  } catch (e) {
    console.log("API request (non-JSON body):", `${API_BASE}${path}`, options.body);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  // Safely parse JSON only when present, and gracefully handle empty/non-JSON responses
  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (res.status === 204) {
    data = null;
  } else if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch (err) {
      // Invalid JSON — read text for debugging/error message
      const text = await res.text();
      data = { message: text || "Invalid JSON response from server" };
    }
  } else {
    const text = await res.text();
    data = text ? { message: text } : null;
  }

  if (!res.ok) {
    const message = data && data.message ? data.message : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

const AUTH_BASE = `${API_BASE}/api/auth`;

export async function register(username, email, password) {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
}

export async function login(email, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}



// Chat history
export async function getChats() {
  const data = await request("/api/chat");
  return data.conversations || [];
}

export async function getChat(chatId) {
  const data = await request(`/api/chat/${chatId}`);
  return data.conversation;
}

// Chat – send message (creates or continues a conversation)
export async function sendChatMessage(message, chatId) {
  const data = await request("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, chatId }),
  });
  return data; // { reply, chatId }
}
 
export async function getMe() {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  return request("/api/auth/me");
}