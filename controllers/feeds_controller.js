exports.getPosts = (req, res, next) => {
  res.status(200).json({posts: [{title: "this is first post"}]});
}

exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: 'Post created succesfully!',
    post: {id: 1, title: title, content: content}
  })
}