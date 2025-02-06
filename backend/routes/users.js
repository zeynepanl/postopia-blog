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

    if (user.isBlocked) {
      return res.status(403).json({ error: "User is blocked. Contact support." });
    }

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
        isBlocked: user.isBlocked,
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

// Kullanıcıyı Silme (Sadece Admin)
router.delete("/delete/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcıyı Bloklama/Bloke Kaldırma (Sadece Admin)
router.put("/block/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body; // block true veya false gelecek

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: block },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: `User ${block ? "blocked" : "unblocked"} successfully.`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcıyı Admin Yapma (Sadece Admin)
router.put("/make-admin/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "User role updated to admin successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
