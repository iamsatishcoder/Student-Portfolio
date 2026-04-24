// backend/routes/contact.js
const express = require("express");
const router = express.Router();

// Example POST route for contact form
router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Later we can add email sending or DB saving here
  res.json({ success: true, msg: "Contact form submitted successfully ✅" });
});

module.exports = router;
