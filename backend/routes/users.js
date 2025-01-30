const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../db/models/User");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//Kullanıcı Kaydı
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const newUser = new User({
      username,
      email,
      password,
      role: role || "user",
    }); // 🔹 Varsayılan olarak "user"
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Kullanıcı Giriş
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, // 🔹 Token içine role ekledik
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Sadece Adminler Kullanıcıları Listeleyebilir
router.get("/all", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Şifreyi göndermiyoruz
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
