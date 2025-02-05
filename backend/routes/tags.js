const express = require("express");
const Tag = require("../db/models/Tag");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//Yeni Etiket Oluştur 
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Tag name is required" });
    }

    // Aynı isimde etiket var mı kontrol et
    let existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ success: false, message: "Tag already exists" });
    }

    const newTag = new Tag({ name });
    await newTag.save();

    res.status(201).json({ success: true, tag: newTag });
  } catch (error) {
    console.error("Tag creation error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

//Etiketleri Listele
router.post("/", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Etiket Güncelle (Sadece Admin)
router.post("/update", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id, name } = req.body;

    const updatedTag = await Tag.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedTag) return res.status(404).json({ message: "Tag not found." });

    res
      .status(200)
      .json({ message: "Tag updated successfully.", tag: updatedTag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Etiket Silme (Sadece Admin)
router.post("/delete", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;

    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) return res.status(404).json({ message: "Tag not found." });

    res.status(200).json({ message: "Tag deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
