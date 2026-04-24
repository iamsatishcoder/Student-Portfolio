const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, bio, contact, profile_image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if email exists
    const existing = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const userId = result.insertId;

    // Insert into students table
    await query(
      "INSERT INTO students (user_id, bio, contact, profile_image) VALUES (?, ?, ?, ?)",
      [userId, bio || "", contact || "", profile_image || ""]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: userId, name, email },
    });
  } catch (err) {
    console.error("❌ Register error:", err.sqlMessage || err.message);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (result.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err.sqlMessage || err.message);
    return res.status(500).json({ message: "Server error", error: err.sqlMessage || err.message });
  }
});

module.exports = router;
