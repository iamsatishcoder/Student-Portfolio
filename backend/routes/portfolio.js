// // backend/routes/portfolio.js
// const express = require("express");
// const db = require("../db"); // your callback-based connection
// const auth = require("../middleware/auth");
// const PDFDocument = require("pdfkit");

// const router = express.Router();

// // ================= GET Portfolio Data =================
// router.get("/", auth, (req, res) => {
//   const userId = req.user.id;

//   // Get student profile
//   db.query("SELECT * FROM students WHERE user_id = ?", [userId], (err, students) => {
//     if (err) {
//       console.error("Error fetching student:", err);
//       return res.status(500).json({ message: "Server error fetching portfolio" });
//     }
//     if (students.length === 0) return res.status(404).json({ message: "Student profile not found" });

//     const student = students[0];

//     // Get education
//     db.query("SELECT * FROM education WHERE student_id = ?", [student.id], (err, education) => {
//       if (err) {
//         console.error("Error fetching education:", err);
//         return res.status(500).json({ message: "Server error fetching portfolio" });
//       }

//       // Get skills
//       db.query("SELECT * FROM skills WHERE student_id = ?", [student.id], (err, skills) => {
//         if (err) {
//           console.error("Error fetching skills:", err);
//           return res.status(500).json({ message: "Server error fetching portfolio" });
//         }

//         // Get projects
//         db.query("SELECT * FROM projects WHERE student_id = ?", [student.id], (err, projects) => {
//           if (err) {
//             console.error("Error fetching projects:", err);
//             return res.status(500).json({ message: "Server error fetching portfolio" });
//           }

//           res.json({ student, education, skills, projects });
//         });
//       });
//     });
//   });
// });

// // ================= Download Portfolio as PDF =================
// router.get("/download", auth, (req, res) => {
//   const userId = req.user.id;

//   // Get student profile
//   db.query("SELECT * FROM students WHERE user_id = ?", [userId], (err, students) => {
//     if (err) {
//       console.error("Error fetching student:", err);
//       return res.status(500).json({ message: "Error generating PDF" });
//     }
//     if (students.length === 0) return res.status(404).json({ message: "Student profile not found" });

//     const student = students[0];

//     // Get education
//     db.query("SELECT * FROM education WHERE student_id = ?", [student.id], (err, education) => {
//       if (err) {
//         console.error("Error fetching education:", err);
//         return res.status(500).json({ message: "Error generating PDF" });
//       }

//       // Get skills
//       db.query("SELECT * FROM skills WHERE student_id = ?", [student.id], (err, skills) => {
//         if (err) {
//           console.error("Error fetching skills:", err);
//           return res.status(500).json({ message: "Error generating PDF" });
//         }

//         // Get projects
//         db.query("SELECT * FROM projects WHERE student_id = ?", [student.id], (err, projects) => {
//           if (err) {
//             console.error("Error fetching projects:", err);
//             return res.status(500).json({ message: "Error generating PDF" });
//           }

//           // Generate PDF
//           const doc = new PDFDocument();
//           res.setHeader("Content-Type", "application/pdf");
//           res.setHeader("Content-Disposition", "attachment; filename=portfolio.pdf");
//           doc.pipe(res);

//           doc.fontSize(20).text("Portfolio", { align: "center" }).moveDown();

//           doc.fontSize(14).text(`Name: ${student.name}`);
//           doc.text(`Bio: ${student.bio || "N/A"}`);
//           doc.text(`Contact: ${student.contact || "N/A"}`);
//           doc.moveDown();

//           doc.fontSize(16).text("Education:", { underline: true });
//           education.forEach((edu) => {
//             doc.fontSize(12).text(`${edu.degree} - ${edu.institution} (${edu.year}) - ${edu.percentage || "N/A"}%`);
//           });
//           doc.moveDown();

//           doc.fontSize(16).text("Skills:", { underline: true });
//           skills.forEach((skill) => {
//             doc.fontSize(12).text(`${skill.skill_name} (${skill.level || "N/A"})`);
//           });
//           doc.moveDown();

//           doc.fontSize(16).text("Projects:", { underline: true });
//           projects.forEach((proj) => {
//             doc.fontSize(12).text(`${proj.title} - ${proj.description || "N/A"}`);
//             if (proj.link) doc.text(`Link: ${proj.link}`);
//             doc.text(`Tech Stack: ${proj.tech_stack || "N/A"}`).moveDown();
//           });

//           doc.end();
//         });
//       });
//     });
//   });
// });

// module.exports = router;


// backend/routes/portfolio.js
const express = require("express");
const db = require("../db"); // your callback-style DB
const auth = require("../middleware/auth"); // existing auth.js
const PDFDocument = require("pdfkit");

const router = express.Router();

// ================= GET Portfolio Data =================
router.get("/", auth, (req, res) => {
  const userId = req.user.id;

  // Get student profile
  db.query("SELECT * FROM students WHERE user_id = ?", [userId], (err, students) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).json({ message: "Server error fetching portfolio" });
    }
    if (!students || students.length === 0)
      return res.status(404).json({ message: "Student profile not found" });

    const profile = students[0];

    // Get education
    db.query("SELECT * FROM education WHERE student_id = ?", [profile.id], (eduErr, education) => {
      if (eduErr) return res.status(500).json({ message: "Error fetching education" });

      // Get skills
      db.query("SELECT * FROM skills WHERE student_id = ?", [profile.id], (skillErr, skills) => {
        if (skillErr) return res.status(500).json({ message: "Error fetching skills" });

        // Get projects
        db.query("SELECT * FROM projects WHERE student_id = ?", [profile.id], (projErr, projects) => {
          if (projErr) return res.status(500).json({ message: "Error fetching projects" });

          res.json({ profile, education, skills, projects });
        });
      });
    });
  });
});

// ================= Download Portfolio as PDF =================
router.get("/download", auth, (req, res) => {
  const userId = req.user.id;

  db.query("SELECT * FROM students WHERE user_id = ?", [userId], (err, students) => {
    if (err) return res.status(500).json({ message: "Server error fetching profile" });
    if (!students || students.length === 0)
      return res.status(404).json({ message: "Student profile not found" });

    const profile = students[0];

    db.query("SELECT * FROM education WHERE student_id = ?", [profile.id], (eduErr, education) => {
      if (eduErr) return res.status(500).json({ message: "Error fetching education" });

      db.query("SELECT * FROM skills WHERE student_id = ?", [profile.id], (skillErr, skills) => {
        if (skillErr) return res.status(500).json({ message: "Error fetching skills" });

        db.query("SELECT * FROM projects WHERE student_id = ?", [profile.id], (projErr, projects) => {
          if (projErr) return res.status(500).json({ message: "Error fetching projects" });

          // Generate PDF
          const doc = new PDFDocument();
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "attachment; filename=portfolio.pdf");
          doc.pipe(res);

          doc.fontSize(20).text("Portfolio", { align: "center" }).moveDown();

          doc.fontSize(14).text(`Name: ${profile.name}`);
          doc.text(`Email: ${profile.email}`);
          doc.text(`Bio: ${profile.bio || "N/A"}`);
          doc.text(`Contact: ${profile.contact || "N/A"}`);
          doc.moveDown();

          doc.fontSize(16).text("Education:", { underline: true });
          education.forEach((edu) => {
            doc.fontSize(12).text(
              `${edu.degree}${edu.field ? " in " + edu.field : ""} - ${edu.institution} (${edu.start_year || edu.year}-${edu.end_year || edu.year}) - ${edu.percentage || "N/A"}%`
            );
          });
          doc.moveDown();

          doc.fontSize(16).text("Skills:", { underline: true });
          skills.forEach((skill) => {
            doc.fontSize(12).text(`${skill.skill_name} (${skill.level || "N/A"})`);
          });
          doc.moveDown();

          doc.fontSize(16).text("Projects:", { underline: true });
          projects.forEach((proj) => {
            doc.fontSize(12).text(`${proj.title} - ${proj.description || "N/A"}`);
            if (proj.link) doc.text(`Link: ${proj.link}`);
            doc.text(`Tech Stack: ${proj.tech_stack || "N/A"}`).moveDown();
          });

          doc.end();
        });
      });
    });
  });
});

module.exports = router;
