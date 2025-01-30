const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  target: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true }, 
  type: { type: String, enum: ["blog", "comment"], required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Like", LikeSchema);
