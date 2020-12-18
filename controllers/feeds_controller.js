const {validationResult} = require('express-validator')


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
  const title = req.body.title;
  const content = req.body.content;
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return res.status(422).json({message: 'Validation failed, entered data is incorrect.', errors: errors.array()});
  }

  res.status(201).json({
    message: 'Post created succesfully!',
    post: {
      _id: new Date().toISOString, 
      title: title, 
      content: content, 
      creator: { name: 'Brian'},
      createdAt: new Date()
    }
  })
}