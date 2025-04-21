import axios from "axios";
import config from "../config/index.js";
import { personalContext } from "../constants/chatbot.js";
import {
  isRelatedToAlJon,
  getRandomOffTopicResponse,
} from "../utils/chatbotUtils.js";

export const processChatMessage = async (message) => {
  if (!isRelatedToAlJon(message)) {
    return { response: getRandomOffTopicResponse() };
  }

  const prompt = `
You are an AI assistant for Al-Jon, a web developer. You should act as if you are representing Al-Jon when 
talking to potential recruiters or clients. Respond in first person as if you are Al-Jon himself.

The following is detailed information about Al-Jon:
${personalContext}

A recruiter or potential client has sent this message:
"${message}"

Respond conversationally and professionally as if you are Al-Jon. Be specific about projects, technologies, 
and experiences when relevant. Keep your responses friendly, confident but humble, and tailored to what a 
recruiter would want to know. If asked about availability for interviews or start dates, express flexibility 
and enthusiasm. For technical questions, demonstrate depth of knowledge but avoid being overly technical 
unless specifically asked.
`;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${config.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let botResponse = "";
    if (response.data && response.data[0] && response.data[0].generated_text) {
      botResponse = response.data[0].generated_text.trim();
      if (botResponse.includes(prompt)) {
        botResponse = botResponse.replace(prompt, "").trim();
      }
    } else {
      botResponse = getFallbackResponse(message);
    }

    return { response: botResponse };
  } catch (error) {
    console.error("Error with chatbot API:", error);
    return { response: getFallbackResponse(message) };
  }
};

function getFallbackResponse(message) {
  const lowerInput = message.toLowerCase();

  if (
    lowerInput.includes("project") ||
    lowerInput.includes("work") ||
    lowerInput.includes("recent")
  ) {
    return "One of my recent projects is 'Eternal Design', a 3D customization platform for gravestones...";
  }
  // ... (rest of the fallback responses)

  return "Thank you for your message. I'm Al-Jon, a full-stack developer...";
}
