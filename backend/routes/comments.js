const express = require("express");
const Comment = require("../db/models/Comment");
const Blog = require("../db/models/Blog");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Yorum ekleme
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { blogId, text } = req.body;
    const userId = req.user.id;

    // 1. Önce yorumu oluştur
    const newComment = new Comment({
      blog: blogId,
      user: userId,
      text: text
    });
    
    // 2. Yorumu kaydet
    const savedComment = await newComment.save();
    
    // 3. Blog'u güncelle ve doğrula
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { 
        $push: { 
          comments: {
            _id: savedComment._id, 
            text: savedComment.text, // Doğru yorum ID'sini kullan
            createdAt: savedComment.createdAt
          }
        } 
      },
      { new: true }
    );

    // 4. Doğrulama kontrolü
    if (!updatedBlog.comments.some(c => c._id.toString() === savedComment._id.toString())) {
      throw new Error('Comment ID mismatch detected');
    }

    res.status(201).json({ 
      message: "Comment added successfully.", 
      comment: savedComment 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Yoruma Yanıt Ekleme
router.post("/reply", authenticateToken, async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Yeni yanıt objesi
    const newReply = {
      user: userId,
      text: text,
      createdAt: new Date(),
    };

    // Yanıtı yorumun içine ekle
    comment.replies.push(newReply);
    await comment.save();

    // Yorumları tekrar çek ve kullanıcının bilgisiyle döndür
    const updatedComment = await Comment.findById(commentId)
      .populate("replies.user", "username email");

    res.status(201).json({
      message: "Reply added successfully.",
      comment: updatedComment,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Yorumu Beğenme/Beğeni Kaldırma
router.post("/like", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const index = comment.likes.indexOf(userId);

    if (index === -1) {
      // Kullanıcı beğenmemişse beğeni ekle
      comment.likes.push(userId);
    } else {
      // Kullanıcı zaten beğenmişse beğeniyi kaldır
      comment.likes.splice(index, 1);
    }

    await comment.save();

    res.status(200).json({
      message: "Comment like status updated.",
      likes: comment.likes.length, // Beğeni sayısını döndür
      likedByUser: index === -1, // Kullanıcının yeni durumu
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Belirli Yorumun Beğeni Sayısını Getirme
router.get("/:commentId/count", async (req, res) => {
  try {
    const likeCount = await Like.countDocuments({
      target: req.params.commentId,
      type: "comment",
    });
    res.status(200).json({ commentId: req.params.commentId, likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Yorumu Silme
router.delete("/delete/:commentId", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this comment." });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      comment.blog,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!updatedBlog) {
      throw new Error("Failed to update Blog, comment not removed.");
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully.", blog: updatedBlog });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Yorumu Güncelleme
router.put("/update", authenticateToken, async (req, res) => {
  try {
    const { commentId, text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to update this comment." });
    }

    comment.text = text;
    await comment.save();

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: comment.blog, "comments._id": commentId },
      { $set: { "comments.$.text": text } },
      { new: true }
    );

    res.status(200).json({ message: "Comment updated successfully.", comment, blog: updatedBlog });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//Belli Bir Bloga Ait Yorumları Getirme
router.get("/:blogId", authenticateToken, async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "username email")
      .populate("replies.user", "username email") // Yanıtlar içindeki kullanıcıları çek
      .sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this blog." });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm yorumları getiren endpoint (authenticateToken kullanabilirsiniz)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "username email")
      .populate("blog", "title _id")  // Burada da post bilgilerini ekleyin.
      .populate("replies.user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
