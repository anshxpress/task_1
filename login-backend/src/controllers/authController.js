const db = require("../config/db");
const bcrypt = require("bcrypt");
const path = require("path");

exports.registerUser = (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  // Check if user exists
  db.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length > 0) {
        return res.status(409).json({
          message: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
        [full_name, email, hashedPassword],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Signup failed" });

          return res.status(201).json({
            message: "User registered successfully",
          });
        }
      );
    }
  );
};

/**
 * LOGIN CONTROLLER
 */
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  const imagePath = req.file ? req.file.path : null;


  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Find user
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      // Check if account locked
      if (user.is_locked) {
        logAttempt(user.user_id, ipAddress, "LOCKED");
        return res.status(403).json({
          message: "Account locked due to multiple failed attempts",
        });
      }

      // Compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (!isMatch) {
          handleFailedAttempt(user, ipAddress);
          return res.status(401).json({
            message: "Invalid password",
            remainingAttempts: 4 - user.failed_attempts,
          });
        }

       // SUCCESS LOGIN
        resetAttempts(user.user_id);

        // Save image if uploaded
        if (imagePath) {
          db.query(
            "UPDATE users SET profile_image=? WHERE user_id=?",
            [imagePath, user.user_id]
          );
        }

        logAttempt(user.user_id, ipAddress, "SUCCESS", imagePath);

        return res.status(200).json({
          message: "Login successful",
          userId: user.user_id,
        });
      });
    }
  );
};

/**
 * FAILED ATTEMPT HANDLER
 */
function handleFailedAttempt(user, ipAddress) {
  const newAttempts = user.failed_attempts + 1;
  const lockAccount = newAttempts > 4;

  db.query(
    "UPDATE users SET failed_attempts=?, is_locked=? WHERE user_id=?",
    [newAttempts, lockAccount, user.user_id]
  );

  logAttempt(user.user_id, ipAddress, lockAccount ? "LOCKED" : "FAILED");
}

/**
 * RESET ATTEMPTS AFTER SUCCESS
 */
function resetAttempts(userId) {
  db.query(
    "UPDATE users SET failed_attempts=0, is_locked=false WHERE user_id=?",
    [userId]
  );
}

function logAttempt(userId, ipAddress, status, imagePath = null) {
  db.query(
    "INSERT INTO login_attempts (user_id, ip_address, status, user_image) VALUES (?, ?, ?, ?)",
    [userId, ipAddress, status, imagePath]
  );
}

