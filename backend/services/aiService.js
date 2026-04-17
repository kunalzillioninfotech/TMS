const axios = require("axios");

const generateAnswer = async (query, contextChunks) => {
  try {
    // Combine context from RAG
    const context = contextChunks.map(c => c.content).join("\n\n");

    const prompt = `
Answer ONLY using the context below. 
If the answer is not found in the context, say "I don't have enough data".

Context:
${context}

Question:
${query}
`;

    // Gemini API Request
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Low temperature for factual RAG answers
          maxOutputTokens: 800,
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Gemini returns data in candidates[0].content.parts[0].text
    return response.data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw new Error("AI generation failed with Gemini");
  }
};

module.exports = { generateAnswer };