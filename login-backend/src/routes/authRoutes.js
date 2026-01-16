const express = require("express");
const router = express.Router();
const upload = require("../middlewares/authMiddleware");
const {
  loginUser,
  registerUser,
} = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/login", upload.single("user_image"), loginUser);

module.exports = router;
