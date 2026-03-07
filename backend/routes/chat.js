import { Router } from "express";
import auth from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";

const router = Router();

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const SYSTEM_PROMPT =
  "You are a helpful and friendly chatbot assistant. Keep your answers concise.";

function buildOpenAIMessages(history, userMessage) {
  const base = [{ role: "system", content: SYSTEM_PROMPT }];
  const mappedHistory = history.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.content,
  }));
  return [
    ...base,
    ...mappedHistory,
    { role: "user", content: userMessage },
  ];
}

// GET /api/chat – list chat history for current user
router.get("/", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.userId })
      .sort({ updatedAt: -1 })
      .select("_id title updatedAt");

    res.json({ conversations });
  } catch (error) {
    console.error("Chat history error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/chat/:id – get a single conversation (messages)
router.get("/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json({ conversation });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/chat  – send a message and get reply (creates or continues a chat)
router.post("/", auth, async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "OpenAI API key not configured" });
    }

    let conversation;

    if (chatId) {
      conversation = await Conversation.findOne({
        _id: chatId,
        user: req.userId,
      });
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    } else {
      const title = message.length > 60 ? `${message.slice(0, 57)}...` : message;
      conversation = await Conversation.create({
        user: req.userId,
        title,
        messages: [],
      });
    }

    const history = conversation.messages || [];
    const messages = buildOpenAIMessages(history, message);

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("[OpenAI] API error:", error);
      return res
        .status(502)
        .json({ message: error?.error?.message || "OpenAI request failed" });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() || "No response.";

    conversation.messages.push(
      { sender: "user", content: message },
      { sender: "robot", content: reply }
    );
    await conversation.save();

    res.json({ reply, chatId: conversation._id });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
