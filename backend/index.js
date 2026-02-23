require('dotenv').config(); // ALWAYS at the top

console.log("THIS IS NEW VERSION");
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Connect to MongoDB
connectDB();

// Auth routes (public)
app.use("/auth", authRoutes);

// API Routes (protected)
app.use("/students", authMiddleware, studentRoutes);

// Frontend Routes
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Serve index.html for all other routes (SPA routing)
// Use regex instead of "*" (Express 5 / path-to-regexp no longer accepts bare "*")
app.get(/^\/(?!students|api)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Frontend available at http://0.0.0.0:${PORT}`);
  console.log(`🔌 API endpoints available at http://0.0.0.0:${PORT}/students`);
});