const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "automatic",
  password: "Auto@1234",
  database: "login_app"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB connect failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL connected");
});

module.exports = db;
