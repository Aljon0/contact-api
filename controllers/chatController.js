import { processChatMessage } from "../services/chatService.js";

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await processChatMessage(message);
    res.json(response);
  } catch (error) {
    console.error("Error in chat handler:", error);
    res
      .status(500)
      .json({ response: "An error occurred while processing your message." });
  }
};
