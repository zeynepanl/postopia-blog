const express = require("express");
const Category = require("../db/models/Category");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//Yeni Kategori Oluştur (Sadece Admin)
router.post("/create", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) return res.status(400).json({ message: "Category already exists." });

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully.", category: newCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Kategorileri Listele
router.get("/", async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "blogs",           // Blog koleksiyonunun adı (genellikle model adının küçük ve çoğul hali)
          localField: "_id",
          foreignField: "categories", // Blog şemasında kategorilerin saklandığı alan adı (örneğin "categories")
          as: "blogList",
        },
      },
      {
        $addFields: {
          blogCount: { $size: "$blogList" },
        },
      },
      {
        $project: { blogList: 0 }, // blogList'i sonuçlardan kaldırıyoruz
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Kategori Güncelle (Sadece Admin)
router.post("/update", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id, name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) return res.status(404).json({ message: "Category not found." });

    res.status(200).json({ message: "Category updated successfully.", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Kategori Silme (Sadece Admin)
router.post("/delete", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: "Category not found." });

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
