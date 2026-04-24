// backend/config/db.js
/*const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",           // change if needed
  password: "Pass@123",           // put your MySQL root password here
  database: "student_portfolio"  // make sure this DB exists in MySQL
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

module.exports = db;
*/

const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",  // make sure this matches your MySQL password
  database: process.env.DB_NAME || "student_portfolio"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

module.exports = db;
