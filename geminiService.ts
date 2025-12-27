import { GoogleGenAI } from "@google/genai";

export const getConstructionEstimate = async (query: string) => {
  // Always use process.env.API_KEY directly as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional construction estimator in India. 
      Answer this user query briefly and suggest specific quantities: ${query}. 
      Keep the answer helpful for someone buying from BuildQuick app.`,
      config: {
        maxOutputTokens: 600,
        thinkingConfig: { thinkingBudget: 300 },
        temperature: 0.7,
      },
    });

    // Directly access .text property
    return response.text || "I couldn't calculate that right now. Please try asking about specific quantities like 'how much cement for a 10x10 wall?'";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error calculating estimate. Please check your connection.";
  }
};