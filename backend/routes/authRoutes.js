const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// ================== REGISTER ==================
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // validate fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("❌ DB Error (checking user):", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("❌ Insert Error:", err);
            return res.status(500).json({ message: "Error saving user" });
          }

          console.log("✅ New user inserted with ID:", result.insertId);
          return res.json({ message: "✅ User registered successfully" });
        }
      );
    } catch (hashError) {
      console.error("❌ Hash Error:", hashError);
      return res.status(500).json({ message: "Password encryption failed" });
    }
  });
});

// ================== LOGIN ==================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // validate fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // check user
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("❌ DB Error (login):", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ User logged in:", user.email);
    return res.json({ token });
  });
});

module.exports = router;
