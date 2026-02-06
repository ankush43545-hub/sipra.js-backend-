const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `You are Sipra, a calm, intelligent, friendly AI assistant.
User: ${userMessage}
Sipra:`
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: "Model is loading, try again in a moment." });
    }

    const reply = data[0]?.generated_text || "Thinking...";
    res.json({ reply: reply.replace(/.*Sipra:/, "").trim() });

  } catch {
    res.json({ reply: "Server connection issue. Try again." });
  }
});

app.listen(3000, () => {
  console.log("Sipra backend running on port 3000");
});
