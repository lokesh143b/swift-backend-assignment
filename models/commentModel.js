const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  name: String,
  email: String,
  body: String,
});

module.exports = mongoose.model("Comment", CommentSchema);
