import express from "express";
import corsMiddleware from "./middlewares/cors.js";
import emailRoutes from "./routes/emailRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import config from "./config/index.js";

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(emailRoutes);
app.use(chatRoutes);

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
