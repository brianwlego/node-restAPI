const {validationResult} = require('express-validator')
const Post = require('../models/post')


//**  INDEX **//
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: "First Post",
        content: "This is the first post!",
        imageUrl: 'images/duck.jpg', 
        creator: {
          name: 'Brian'
        },
        createdAt: new Date()
      }
    ]}
  );
}

//** CREATE **//
exports.postPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return res.status(422).json({message: 'Validation failed, entered data is incorrect.', errors: errors.array()});
  }
  
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: {name: 'Brian'}
  })
  post.save()
    .then(result => {
      res.status(201).json({
        message: 'Post created succesfully!',
        post: result
      })
    })
    .catch(err=>console.log(err))

}