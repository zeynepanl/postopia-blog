// routes/dashboard.js
const express = require("express");
const Blog = require("../db/models/Blog");
const User = require("../db/models/User");
const Comment = require("../db/models/Comment");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // En popüler kategori (blog sayısına göre)
    const popularCategoryAgg = await Blog.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostPopularCategory = popularCategoryAgg[0]?._id || "N/A";

    // Kategori dağılımı: Her kategori için blog sayısı
    const categoryDistributionAgg = await Blog.aggregate([
      { $unwind: "$categories" },
      {
        $lookup: {
          from: "categories", // Koleksiyon adının doğru yazıldığından emin olun (küçük harf)
          localField: "categories",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name", // _id artık kategori adını içerir
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);    

    res.json({
      totalBlogs,
      totalUsers,
      totalComments,
      mostPopularCategory,
      categoryDistribution: categoryDistributionAgg,
      blockedUsers, // Bu alana API yanıtında yer veriliyor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
