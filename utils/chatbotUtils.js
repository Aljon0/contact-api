import { alJonKeywords, offTopicResponses } from "../constants/chatbot.js";

export function isRelatedToAlJon(message) {
  const loweredMessage = message.toLowerCase();

  if (/^(hi|hello|hey|greetings)[\s!,.?]*$/i.test(loweredMessage)) {
    return true;
  }

  return alJonKeywords.some((keyword) => loweredMessage.includes(keyword));
}

export function getRandomOffTopicResponse() {
  const randomIndex = Math.floor(Math.random() * offTopicResponses.length);
  return offTopicResponses[randomIndex];
}
