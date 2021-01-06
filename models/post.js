const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: String,
  imgUrl: String,
  content: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema)