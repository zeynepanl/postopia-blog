const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  replies: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);
