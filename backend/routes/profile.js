// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET profile
router.get("/", (req, res) => {
  db.query("SELECT * FROM profile LIMIT 1", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

module.exports = router;
