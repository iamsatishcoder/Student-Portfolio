// // routes/studentRoutes.js
// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const verifyToken = require("../middleware/auth"); // import correctly

// // Helper: fetch joined profile (students + users) by user_id
// function fetchProfile(user_id, cb) {
//   const sql = `
//     SELECT s.user_id, u.name, u.email, s.bio, s.contact, s.profile_image
//     FROM students s
//     JOIN users u ON u.id = s.user_id
//     WHERE s.user_id = ?
//     LIMIT 1
//   `;
//   db.query(sql, [user_id], (err, rows) => {
//     if (err) return cb(err);
//     if (!rows || rows.length === 0) return cb(null, null);
//     const r = rows[0];
//     cb(null, {
//       user_id: r.user_id,
//       name: r.name,
//       email: r.email,
//       bio: r.bio,
//       contact: r.contact,
//       profile_image: r.profile_image,
//     });
//   });
// }

// /**
//  * CREATE or UPDATE student profile
//  * Body: { user_id, bio, contact, profile_image }
//  */
// router.post("/profile", verifyToken, (req, res) => {
//   let { user_id, bio, contact, profile_image } = req.body;

//   // Ensure user_id matches token
//   if (!req.user || req.user.id !== Number(user_id)) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   user_id = Number(user_id);

//   if (!user_id || Number.isNaN(user_id)) {
//     return res.status(400).json({ message: "user_id is required and must be a number" });
//   }

//   db.query("SELECT id FROM users WHERE id = ?", [user_id], (uErr, uRows) => {
//     if (uErr) return res.status(500).json({ message: "Database error", error: uErr.sqlMessage });
//     if (!uRows || uRows.length === 0) return res.status(404).json({ message: "User not found" });

//     db.query("SELECT id FROM students WHERE user_id = ?", [user_id], (sErr, sRows) => {
//       if (sErr) return res.status(500).json({ message: "Database error", error: sErr.sqlMessage });

//       const saveProfile = (callback) => {
//         fetchProfile(user_id, (fErr, profile) => {
//           if (fErr) return res.status(500).json({ message: "Profile fetch failed", error: fErr.sqlMessage });
//           callback(profile);
//         });
//       };

//       if (sRows && sRows.length > 0) {
//         // Update existing
//         const upd = "UPDATE students SET bio=?, contact=?, profile_image=? WHERE user_id=?";
//         db.query(upd, [bio || null, contact || null, profile_image || null, user_id], (u2Err) => {
//           if (u2Err) return res.status(500).json({ message: "Error updating profile", error: u2Err.sqlMessage });
//           saveProfile((profile) => res.json({ message: "Profile updated", profile }));
//         });
//       } else {
//         // Insert new
//         const ins = "INSERT INTO students (user_id, bio, contact, profile_image) VALUES (?, ?, ?, ?)";
//         db.query(ins, [user_id, bio || null, contact || null, profile_image || null], (iErr) => {
//           if (iErr) return res.status(500).json({ message: "Error creating profile", error: iErr.sqlMessage });
//           saveProfile((profile) => res.json({ message: "Profile created", profile }));
//         });
//       }
//     });
//   });
// });

// /**
//  * GET single profile by user_id
//  */
// router.get("/profile/:user_id", (req, res) => {
//   const user_id = Number(req.params.user_id);
//   if (!user_id || Number.isNaN(user_id)) return res.status(400).json({ message: "user_id must be a number" });

//   fetchProfile(user_id, (err, profile) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage });
//     if (!profile) return res.status(404).json({ message: "Profile not found" });
//     return res.json(profile);
//   });
// });

// /**
//  * GET all profiles
//  */
// router.get("/", (req, res) => {
//   const sql = `
//     SELECT s.user_id, u.name, u.email, s.bio, s.contact, s.profile_image
//     FROM students s
//     JOIN users u ON u.id = s.user_id
//   `;
//   db.query(sql, (err, rows) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage });
//     const profiles = rows.map((r) => ({
//       user_id: r.user_id,
//       name: r.name,
//       email: r.email,
//       bio: r.bio,
//       contact: r.contact,
//       profile_image: r.profile_image,
//     }));
//     return res.json(profiles);
//   });
// });

// /**
//  * DELETE user+profile by user_id
//  */
// router.delete("/profile/:user_id", (req, res) => {
//   const user_id = Number(req.params.user_id);
//   if (!user_id || Number.isNaN(user_id)) return res.status(400).json({ message: "user_id must be a number" });
//   db.query("DELETE FROM users WHERE id = ?", [user_id], (err, result) => {
//     if (err) return res.status(500).json({ message: "Error deleting user", error: err.sqlMessage });
//     if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
//     return res.json({ message: "User and profile deleted successfully" });
//   });
// });

// /**
//  * GET logged-in user profile
//  */
// router.get("/me", verifyToken, (req, res) => {
//   const user_id = req.user.id;
//   if (!user_id) return res.status(401).json({ message: "Unauthorized" });

//   fetchProfile(user_id, (err, profile) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err.sqlMessage });
//     if (!profile) return res.status(404).json({ message: "Profile not found" });
//     return res.json(profile);
//   });
// });

// module.exports = router;






const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");
const util = require("util");
const query = util.promisify(db.query).bind(db);



/**
 * Helper: fetch joined profile (users + students)
 */
async function fetchProfile(user_id) {
  const sql = `
    SELECT u.id AS user_id, u.name, u.email, s.bio, s.contact, s.profile_image
    FROM users u
    LEFT JOIN students s ON u.id = s.user_id
    WHERE u.id = ?
    LIMIT 1
  `;
  const rows = await query(sql, [user_id]);
  return rows[0] || null;
}

/**
 * Create or update student profile
 * Body: { bio, contact, profile_image }
 */
router.post("/profile", verifyToken, async (req, res) => {
  const user_id = req.user.id;
  const { bio, contact, profile_image } = req.body;

  try {
    const existing = await query("SELECT id FROM students WHERE user_id = ?", [user_id]);

    if (existing.length > 0) {
      await query(
        "UPDATE students SET bio=?, contact=?, profile_image=? WHERE user_id=?",
        [bio || null, contact || null, profile_image || null, user_id]
      );
      const profile = await fetchProfile(user_id);
      return res.json({ message: "Profile updated", profile });
    } else {
      await query(
        "INSERT INTO students (user_id, bio, contact, profile_image) VALUES (?, ?, ?, ?)",
        [user_id, bio || null, contact || null, profile_image || null]
      );
      const profile = await fetchProfile(user_id);
      return res.json({ message: "Profile created", profile });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.sqlMessage || err });
  }
});

/**
 * Get logged-in user profile
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const profile = await fetchProfile(req.user.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.sqlMessage || err });
  }
});

/**
 * Get logged-in user portfolio (profile + education + skills + projects)
 */
router.get("/portfolio/me", verifyToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    // 1️⃣ Profile
    const profile = await fetchProfile(user_id);

    // 2️⃣ Get student internal ID
    const studentRes = await query("SELECT id FROM students WHERE user_id = ?", [user_id]);
    const student_id = studentRes[0]?.id;

    // If student profile not found, return empty arrays
    if (!student_id) {
      return res.json({
        profile,
        education: [],
        skills: [],
        projects: [],
      });
    }

    // 3️⃣ Fetch related tables using student_id
    const education = await query("SELECT * FROM education WHERE student_id = ?", [student_id]);
    const skills = await query("SELECT * FROM skills WHERE student_id = ?", [student_id]);
    const projects = await query("SELECT * FROM projects WHERE student_id = ?", [student_id]);

    return res.json({
      profile,
      education,
      skills,
      projects,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.sqlMessage || err });
  }
});

module.exports = router;





