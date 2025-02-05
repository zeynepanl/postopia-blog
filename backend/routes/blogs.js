


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
    console.log("Backend'e Gelen İstek Verisi:", req.body);

    const { title, content, categories, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title ve content alanları zorunludur." });
    }

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
    res
      .status(200)
      .json({ message: "Blog post updated successfully.", blog });
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

router.get("/latest", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 }) 
      .limit(10) 
      .populate("author", "username email")
      .populate("categories", "name")
      .populate("tags", "name");

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/popular", async (req, res) => {
  try {
    console.log("Popüler bloglar API çağrıldı!");

    const blogs = await Blog.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" }, 
          score: {
            $add: [
              { $multiply: [{ $size: "$likes" }, 2] }, 
              { $size: "$comments" } 
            ]
          }
        }
      },
      {
        $sort: { score: -1 } 
      },
      {
        $limit: 10 
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      {
        $unwind: "$author"
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }
      }
    ]);

    console.log("Gönderilen popüler bloglar:", blogs);
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Popüler bloglar çekilirken hata:", error);
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
    const { id } = req.body; // 🔥 API'ye gelen 'id' değişkenini al
    console.log("Beğeni isteği alındı, Blog ID:", id);

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const existingLike = await Like.findOne({ user: req.user.id, target: id, type: "blog" });

    if (existingLike) {
      // Eğer zaten beğendiyse, beğeniyi kaldır
      await existingLike.deleteOne();
      blog.likes = blog.likes.filter((userId) => userId.toString() !== req.user.id);
      await blog.save();
      return res.status(200).json({ message: "Blog unliked.", likes: blog.likes });
    }

    // Eğer daha önce beğenmemişse yeni beğeni ekle
    const newLike = new Like({ user: req.user.id, target: id, type: "blog" });
    await newLike.save();
    blog.likes.push(req.user.id);
    await blog.save();

    res.status(201).json({ message: "Blog liked.", likes: blog.likes });
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

// Kullanıcının kendi bloglarını listeleme (POST)
router.post("/my-blogs", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userBlogs = await Blog.find({ author: userId })
      .populate("author", "username email")
      .populate("categories", "name")
      .populate("tags", "name");

    res.status(200).json(userBlogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

