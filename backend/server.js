const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const skillRoutes = require("./routes/skills");
const authRoutes = require("./routes/auth");
const educationRoutes = require("./routes/education");
const projectRoutes = require("./routes/projects");
const portfolioRoutes = require("./routes/portfolio");

  

// Use Routes
app.use("/api/students", studentRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Test route
app.get("/test", (req, res) => {
  res.send("Backend is working!");
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
