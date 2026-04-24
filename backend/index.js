const express = require("express");
const cors = require("cors");
require("dotenv").config(); // load environment variables

const profileRoutes = require("./routes/profile");
const educationRoutes = require("./routes/education");
const skillsRoutes = require("./routes/skills");
const projectRoutes = require("./routes/projects");
const resumeRoutes = require("./routes/resume");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing JSON request bodies

// Routes
app.use("/profile", profileRoutes);
app.use("/education", educationRoutes);
app.use("/skills", skillsRoutes);
app.use("/projects", projectRoutes);
app.use("/resume", resumeRoutes);
app.use("/contact", contactRoutes);
app.use("/auth", authRoutes);

// Default route to check API
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

