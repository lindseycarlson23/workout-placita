const mongoose = require("mongoose");
// Comment Schema
//make a comment js file and copy code over.
const commentSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  commentBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
    },
  ]
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
