const {validationResult} = require('express-validator')
const Post = require('../models/post')
const User = require('../models/user')


//**  INDEX **//
exports.indexPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('creator')
    res.status(200).json({
      posts: posts
    });
  } catch (error) {
    if (!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
}

//** SHOW **//
exports.showPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post){
      const error = new Error('Post not found');
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({
        post: post
      })
    }
  } catch (error) {
    if (!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
}

//** CREATE **//
exports.createPost = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imgUrl: '/images/book-img.jpeg',
      creator: req.userId
    })
    await post.save();
    const user = await User.findById(req.userId);
      user.posts.push(post);
    await user.save();
    const savedPost = await Post.findById(post._id).populate('creator');
    res.status(201).json({
      message: 'Post created succesfully!',
      post: savedPost,
      creator: {_id: user._id, name: user.name}
    })
  } catch (error) {
    if (!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
}

//** EDIT **//
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post){
      const error = new Error('could not find post');
      error.statusCode = 404;
      throw error;
    } else if (post.creator.toString() !== req.userId){
      const err = new Error('Not authorized to change post')
      err.statusCode = 403;
      throw err;
    } else {
      post.title = req.body.title;
      post.content = req.body.content;
      await post.save();
      res.status(200).json({ post: post })
    }
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post){
      const error = new Error('could not find post');
      error.statusCode = 404;
      throw error;
    } else if (post.creator.toString() !== req.userId){
      const err = new Error('Not authorized to change post')
      err.statusCode = 403;
      throw err;
    } else {
      await Post.findByIdAndRemove(req.params.id)
      const user = await User.findById(req.userId)
      user.posts.pull(post._id)
      await user.save();
      res.status(200).json({message: 'Post was deleted.'})
    }
  } catch (error){
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
}