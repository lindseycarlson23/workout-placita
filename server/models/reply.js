const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  replyId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  replyBody: {
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
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;