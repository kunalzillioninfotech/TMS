// const express = require("express");
// const { searchRAG } = require("../services/ragService");
// const { generateAnswer } = require("../services/aiService");

// const router = express.Router();

// router.post("/ask", async (req, res) => {
//   try {
//     const { question } = req.body;

//     const chunks = await searchRAG(question);
//     const answer = await generateAnswer(question, chunks);

//     res.json({ answer });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const { searchRAG } = require("../services/ragService");
const { generateAnswer } = require("../services/aiService");

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // 1. Get chunks from RAG
    const chunks = await searchRAG(question);
    
    // 2. Pass chunks to Gemini/AI Service
    // Even if chunks is empty, generateAnswer will handle it
    const answer = await generateAnswer(question, chunks);

    res.json({ answer });
  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

module.exports = router;