import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

// Routes
import quizRoutes from "./routes/quiz.js";
import studentQuizRoutes from "./routes/studentQuiz.js";
import usersRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import adminRoutes from "./routes/admins.js";
import studentRoutes from "./routes/students.js";
import leaderboardRouter from "./routes/leaderboard.js";
import quotesRoute from "./routes/quotes.js";

// ---------------- BASIC SETUP ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// ---------------- SECURITY ----------------
app.use(helmet({ contentSecurityPolicy: false }));

// ---------------- CORS (NODE 20 SAFE) ----------------
app.use(
  cors({
    origin: [
      "https://swanzaa.com",
      "https://www.swanzaa.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------- RATE LIMIT ----------------
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ---------------- BODY PARSER ----------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------------- DATABASE ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// ---------------- HEALTH ----------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    backend: "swanzaa",
    time: new Date().toISOString(),
  });
});

// ---------------- ROUTES ----------------
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/admins", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/student-quiz", studentQuizRoutes);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/quotes", quotesRoute);

// ---------------- START ----------------
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
