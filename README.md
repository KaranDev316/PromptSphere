


# 🚀 PromptSphere

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![AI Powered](https://img.shields.io/badge/AI-OpenAI-orange)

> A minimal AI chat workspace built for speed, clarity, and real conversations.

---

## ✨ Overview

PromptSphere is a full-stack AI chat application built using the **MERN stack**, designed to deliver a clean and distraction-free conversational experience.

Unlike feature-heavy AI tools, PromptSphere focuses on:
- ⚡ Fast response cycles  
- 🧘 Minimal UI/UX  
- 💬 Persistent conversations  
- 🔐 Secure authentication  

---

## 🌐 Live Demo

👉 https://prompt-sphere-gules.vercel.app/

---

## 📸 Screenshots

### 🏠 Landing Page
<!-- ADD IMAGE HERE -->
![Landing Page](./screenshots/landing.png)

---

### 🔐 Authentication
<!-- ADD IMAGE HERE -->
![Auth](./screenshots/auth.png)

---

### 💬 Chat Interface
<!-- ADD IMAGE HERE -->
![Chat UI](./screenshots/chat.png)

---


## 🏗️ Architecture

```mermaid
graph TD
    A[Client - React / Next.js] --> B[Express Server]
    B --> C[MongoDB Database]
    B --> D[OpenAI API]

```
🛠️ Tech Stack
Frontend
* React / Next.js
* Tailwind CSS
Backend
* Node.js
* Express.js
Database
* MongoDB (Mongoose)
AI
* OpenAI API
Deployment
* Vercel (Frontend)
* Backend (Render / Railway)

🔐 Authentication
* JWT-based authentication
* Protected routes
* Secure login & registration

💬 Features
* 🧠 AI-powered conversations
* 💾 Chat history persistence
* ➕ Create multiple chats
* ⚡ Fast API responses
* 🎯 Clean and minimal UI

📂 Folder Structure
/client
  /components
  /pages
  /utils

/server
  /controllers
  /routes
  /models
  /middleware

⚙️ Installation
1. Clone the repository
git clone https://github.com/your-username/promptsphere.git
cd promptsphere

2. Setup backend
cd server
npm install
Create .env file:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENAI_API_KEY=your_api_key
Run server:
npm run dev

3. Setup frontend
cd client
npm install
npm run dev

🚧 Future Improvements
* 🔄 Streaming responses
* 📁 File uploads (PDF, images)
* 🔍 Chat search
* 🧠 Memory system
* 🌐 Multi-model support

📈 Learnings
* Simplicity improves retention
* UX matters more than model choice
* Latency is critical in AI apps
* Backend design is the real bottleneck

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

📄 License
MIT License
---

# 🧠 Architecture Diagram (Visual Upgrade)

Use this if you want something more **impressive than basic mermaid** (great for portfolio or Notion):

---

## 🔷 System Architecture

    ┌────────────────────────────┐
    │        Frontend            │
    │      React    +   UI    
    └────────────┬──────────────┘
                 │ HTTP Requests
                 ▼
    ┌────────────────────────────┐
    │        Backend API         │
    │     Node.js / Express      │
    └────────────┬──────────────┘
         │                    │
         ▼                    ▼
┌───────────────────┐ ┌────────────────────┐
│ MongoDB │ │ OpenAI API │ │ (Chat Storage) │
└───────────────────┘ └────────────────────┘
         │ (AI Responses) │   
---

## 🔄 Request Flow

User Input ↓ Frontend (UI) ↓ Backend API ↓ OpenAI API ↓ Response Processing ↓ MongoDB Storage ↓ Frontend Update
---
