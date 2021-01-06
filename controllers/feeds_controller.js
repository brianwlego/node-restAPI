const {validationResult} = require('express-validator')
const Post = require('../models/post')
const User = require('../models/user')


//**  INDEX **//
exports.indexPosts = (req, res, next) => {
  Post.find().populate('creator')
    .then(posts => {
      res.status(200).json({
        posts: posts
      });
    })
    .catch(error => {
      if (!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    })
}

//** SHOW **//
exports.showPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post){
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      } else {
        res.status(200).json({
          post: post
        })
      }
    })
    .catch(error => {
      if (!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    })
}

//** CREATE **//
exports.createPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422;
    throw error;
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imgUrl: '/images/book-img.jpeg',
    creator: req.userId
  })
  let creator;
  post.save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      user.save();
      return Post.findById(post._id).populate('creator')
    })
    .then((innerPost) => {
      res.status(201).json({
        message: 'Post created succesfully!',
        post: innerPost,
        creator: {_id: creator._id, name: creator.name}
      })
    })
    .catch(error => {
      if (!error.statusCode){
        error.statusCode = 500;
      }
      next(error);
    })

}

//** EDIT **//
exports.updatePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
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
        return post.save();
      }
    })
    .then(result => {
      res.status(200).json({
        post: result
      })
    })
    .catch(error => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    })
}

exports.deletePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post){
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      } else if (post.creator.toString() !== req.userId){
        const err = new Error('Not authorized to change post')
        err.statusCode = 403;
        throw err;
      } else {
        return Post.findByIdAndRemove(req.params.id)
      }
    })
    .then(() => {
      res.status(200).json({
        message: 'Post was deleted.'
      })
    })
    .catch(error => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    })
}