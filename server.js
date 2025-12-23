// backend/server.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// Routes
import quizRoutes from "./routes/quiz.js";
import studentQuizRoutes from "./routes/studentQuiz.js";
import usersRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import adminRoutes from "./routes/admins.js";
import studentRoutes from "./routes/students.js";
import leaderboardRouter from "./routes/leaderboard.js";
import quotesRoute from "./routes/quotes.js";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Load env
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ CREATE APP FIRST
const app = express();

// 🔐 SECURITY MIDDLEWARES (ORDER IMPORTANT)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize());

// 🔒 Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000","https://swanzaa.com", "https://www.swanzaa.com"],
    credentials: true,
  })
);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Routes
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/admins", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/student-quiz", studentQuizRoutes);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/quotes", quotesRoute);

const port = process.env.PORT || 5004;
app.listen(port, () => {
  console.log("Server running on port", port);
});