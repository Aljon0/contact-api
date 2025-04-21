import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
};

export default config;
