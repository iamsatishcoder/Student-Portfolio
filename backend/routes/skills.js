const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const util = require("util");
const query = util.promisify(db.query).bind(db);

// helper: get students.id by users.id
async function getStudentIdByUserId(userId) {
  const rows = await query("SELECT id FROM students WHERE user_id = ?", [userId]);
  if (!rows || rows.length === 0) return null;
  return rows[0].id;
}

// ================= ADD SKILL =================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { skill_name, level } = req.body;
    if (!skill_name) return res.status(400).json({ message: "skill_name is required" });

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found. Create profile first." });

    const result = await query(
      "INSERT INTO skills (student_id, skill_name, level) VALUES (?, ?, ?)",
      [studentId, skill_name, level || null]
    );
    return res.status(201).json({
      message: "✅ Skill added",
      skill: { id: result.insertId, student_id: studentId, skill_name, level: level || null }
    });
  } catch (err) {
    console.error("❌ Add skill error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= GET ALL SKILLS FOR LOGGED-IN USER =================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.json([]); // no profile → no skills

    const rows = await query("SELECT id, skill_name, level, created_at FROM skills WHERE student_id = ? ORDER BY created_at DESC", [studentId]);
    return res.json(rows);
  } catch (err) {
    console.error("❌ Get skills error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= UPDATE SKILL =================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const skillId = req.params.id;
    const { skill_name, level } = req.body;

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found" });

    const result = await query(
      "UPDATE skills SET skill_name = ?, level = ? WHERE id = ? AND student_id = ?",
      [skill_name, level, skillId, studentId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Skill not found" });
    return res.json({ message: "✅ Skill updated" });
  } catch (err) {
    console.error("❌ Update skill error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= DELETE SKILL =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const skillId = req.params.id;

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found" });

    const result = await query("DELETE FROM skills WHERE id = ? AND student_id = ?", [skillId, studentId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Skill not found" });
    return res.json({ message: "✅ Skill deleted" });
  } catch (err) {
    console.error("❌ Delete skill error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

module.exports = router;
