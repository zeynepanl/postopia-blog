const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../db/models/Blog");
const Category = require("../db/models/Category");
const Tag = require("../db/models/Tag");
const Like = require("../db/models/Like");

const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//Blog Yazısı Oluşturma (POST)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const { title, content, categories, tags } = req.body;

    const newBlog = new Blog({
      title,
      content,
      author: req.user.id,
      categories,
      tags,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog post created successfully.", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Blog Yazısı Güncelleme (POST)
router.post("/update", authenticateToken, async (req, res) => {
  try {
    const { id, title, content, categories, tags } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog post not found." });

    // Yalnızca blog yazarı veya admin güncelleyebilir
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this blog post." });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.categories = categories || blog.categories;
    blog.tags = tags || blog.tags;

    await blog.save();
    res.status(200).json({ message: "Blog post updated successfully.", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Blog Yazısı Silme (POST)
router.post("/delete", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog post not found." });

    // Yalnızca blog yazarı veya admin silebilir
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this blog post." });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Tüm Blog Yazılarını Getirme (POST)
router.post("/list", authenticateToken, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .populate("categories", "name")
      .populate("tags", "name");

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Tekil Blog Yazısını Getirme (POST)
router.post("/details", async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id)
      .populate("author", "username email")
      .populate("categories", "name")
      .populate("tags", "name");

    if (!blog) return res.status(404).json({ message: "Blog post not found." });

    blog.views += 1; // Görüntüleme sayısını artır
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog Beğenme / Beğeni Kaldırma
router.post("/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog post not found." });

    const existingLike = await Like.findOne({
      user: req.user.id,
      target: id,
      type: "blog",
    });

    if (existingLike) {
      // Beğeni kaldırma işlemi
      await existingLike.deleteOne();
      blog.likes = blog.likes.filter(
        (userId) => userId.toString() !== req.user.id
      );
      await blog.save();
      return res.status(200).json({ message: "Blog unliked." });
    }

    // Yeni beğeni ekleme
    const newLike = new Like({
      user: req.user.id,
      target: id,
      type: "blog",
    });
    await newLike.save();

    // Blog dokümanına kullanıcıyı `likes` alanına ekleyelim
    blog.likes.push(req.user.id);
    await blog.save();

    res.status(201).json({ message: "Blog liked." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Belirli Blogun Beğeni Sayısını Getirme
router.get("/:blogId/count", async (req, res) => {
  try {
    const likeCount = await Like.countDocuments({
      target: req.params.blogId,
      type: "blog",
    });
    res.status(200).json({ blogId: req.params.blogId, likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Blog Yazılarını Arama ve Filtreleme (POST)
router.post("/search", async (req, res) => {
  try {
    const { title, author, categories, tags, startDate, endDate } = req.body;
    let filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };

    if (author && mongoose.Types.ObjectId.isValid(author)) {
      filter.author = author;
    }

    if (categories) {
      const categoryIds = await Category.find({
        name: { $in: categories },
      }).select("_id");
      filter.categories = { $in: categoryIds.map((cat) => cat._id) };
    }

    if (tags && tags.length > 0) {
      const tagIds = await Tag.find({
        name: { $in: tags },
      }).select("_id");
      filter.tags = { $in: tagIds.map((tag) => tag._id) };
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const blogs = await Blog.find(filter)
      .populate("author", "username email")
      .populate("categories", "name")
      .populate("tags", "name");

    if (blogs.length === 0)
      return res
        .status(404)
        .json({ message: "No blog posts found with the given criteria." });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
