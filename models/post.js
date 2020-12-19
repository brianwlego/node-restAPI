const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: String,
  imgUrl: String,
  content: String,
  creator: {
    type: Object,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema)