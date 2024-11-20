import model from "../config/googleGenerativeAI.js";

export const generateChatTitle = async (text) => {
  try {
    const result = await model.generateContent(
      `Provide a one sentence, single-line, maximum five words, concise 
      and title that captures the main idea of the following message: "${text}". Please provide only plain text without any markdown or symbols at the start.`
    );

    const title = result.response?.text
      ? result.response.text().trim().replace(/^#+\s*/, "")
      : null;

    return title || "Untitled Chat";
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "Untitled Chat"; 
  }
};
