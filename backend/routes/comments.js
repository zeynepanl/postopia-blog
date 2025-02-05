const express = require("express");
const Comment = require("../db/models/Comment");
const Blog = require("../db/models/Blog");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//Yorum Ekleme
// Yorum ekleme işlemini düzelt
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
// Yoruma Yanıt Ekleme
router.post("/reply", authenticateToken, async (req, res) => {
  try {
    const { commentId, text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Yeni yanıt objesi oluştur
    const newReply = {
      user: userId,
      text: text,
      createdAt: new Date(),
    };

    // Yoruma yanıtı ekle
    comment.replies.push(newReply);
    await comment.save();

    res.status(201).json({ 
      message: "Reply added successfully.", 
      reply: newReply, 
      commentId: comment._id 
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

//Yorumu Silme (Yalnızca Yorum Sahibi veya Admin)
router.post("/delete", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found." });

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment." });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Belli Bir Bloga Ait Yorumları Getirme
router.get("/:blogId", authenticateToken, async (req, res) => {
  try {
    const { blogId } = req.params;

    // 🔥 `populate("user")` ekleyerek kullanıcı bilgilerini çek
    const comments = await Comment.find({ blog: blogId })
      .populate("user", "username email") // Kullanıcı adı ve e-posta bilgisini ekle
      .sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this blog." });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
