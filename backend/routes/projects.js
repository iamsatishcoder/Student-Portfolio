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

// ================= ADD PROJECT =================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, link, tech_stack } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found. Create profile first." });

    const result = await query(
      "INSERT INTO projects (student_id, title, description, link, tech_stack) VALUES (?, ?, ?, ?, ?)",
      [studentId, title, description || null, link || null, tech_stack || null]
    );
    return res.status(201).json({
      message: "✅ Project added",
      project: { id: result.insertId, student_id: studentId, title, description, link, tech_stack }
    });
  } catch (err) {
    console.error("❌ Add project error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= GET ALL PROJECTS FOR LOGGED-IN USER =================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.json([]); // no profile → no projects

    const rows = await query(
      "SELECT id, title, description, link, tech_stack FROM projects WHERE student_id = ? ORDER BY id DESC",
      [studentId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ Get projects error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= UPDATE PROJECT =================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { title, description, link, tech_stack } = req.body;

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found" });

    const result = await query(
      "UPDATE projects SET title = ?, description = ?, link = ?, tech_stack = ? WHERE id = ? AND student_id = ?",
      [title, description, link, tech_stack, projectId, studentId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "✅ Project updated" });
  } catch (err) {
    console.error("❌ Update project error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= DELETE PROJECT =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found" });

    const result = await query("DELETE FROM projects WHERE id = ? AND student_id = ?", [projectId, studentId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Project not found" });
    return res.json({ message: "✅ Project deleted" });
  } catch (err) {
    console.error("❌ Delete project error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

module.exports = router;
