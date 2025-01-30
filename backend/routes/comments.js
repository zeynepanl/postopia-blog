const express = require("express");
const Comment = require("../db/models/Comment");
const Blog = require("../db/models/Blog");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//Yorum Ekleme
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { blogId, text } = req.body;

    const comment = new Comment({
      blog: blogId,
      user: req.user.id,
      text,
    });

    await comment.save();
    res.status(201).json({ message: "Comment added successfully.", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Yoruma Yanıt Ekleme
router.post("/reply", authenticateToken, async (req, res) => {
  try {
    const { commentId, text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found." });

    comment.replies.push({ user: req.user.id, text });
    await comment.save();

    res.status(201).json({ message: "Reply added successfully.", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Yorumu Beğenme/Beğeni Kaldırma
router.post("/like", authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found." });

    const index = comment.likes.indexOf(req.user.id);
    if (index === -1) {
      comment.likes.push(req.user.id);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();
    res.status(200).json({
      message: "Comment like status updated.",
      likes: comment.likes.length,
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

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "username email")
      .populate("replies.user", "username email")
      .sort({ createdAt: -1 }); // En yeni yorumlar en üstte olacak şekilde sıralar.

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this blog." });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
