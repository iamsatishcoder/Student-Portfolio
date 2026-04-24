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

// ================= ADD EDUCATION =================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { institution, degree, year, percentage } = req.body;

    if (!institution || !degree || !year) {
      return res.status(400).json({ message: "institution, degree, and year are required" });
    }

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId)
      return res.status(404).json({ message: "Student profile not found. Create profile first." });

    const result = await query(
      "INSERT INTO education (student_id, institution, degree, year, percentage) VALUES (?, ?, ?, ?, ?)",
      [studentId, institution, degree, year, percentage || null]
    );

    return res.status(201).json({
      message: "✅ Education record added",
      education: { id: result.insertId, student_id: studentId, institution, degree, year, percentage }
    });
  } catch (err) {
    console.error("❌ Add education error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= GET ALL EDUCATION FOR LOGGED-IN USER =================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.json([]);

    const rows = await query(
      "SELECT id, institution, degree, year, percentage FROM education WHERE student_id = ? ORDER BY year DESC",
      [studentId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ Get education error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= UPDATE EDUCATION =================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const eduId = req.params.id;
    const { institution, degree, year, percentage } = req.body;

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found" });

    const result = await query(
      "UPDATE education SET institution = ?, degree = ?, year = ?, percentage = ? WHERE id = ? AND student_id = ?",
      [institution, degree, year, percentage || null, eduId, studentId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Education record not found" });

    return res.json({ message: "✅ Education updated" });
  } catch (err) {
    console.error("❌ Update education error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

// ================= DELETE EDUCATION =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const eduId = req.params.id;

    const studentId = await getStudentIdByUserId(userId);
    if (!studentId) return res.status(404).json({ message: "Student profile not found" });

    const result = await query("DELETE FROM education WHERE id = ? AND student_id = ?", [eduId, studentId]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Education record not found" });

    return res.json({ message: "✅ Education deleted" });
  } catch (err) {
    console.error("❌ Delete education error:", err.sqlMessage || err);
    return res.status(500).json({ message: "Database error", error: err.sqlMessage || err.message });
  }
});

module.exports = router;
