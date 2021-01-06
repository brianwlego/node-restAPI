const express = require('express')
const router = express.Router();
const { body } = require('express-validator')

const feedController = require('../controllers/feeds_controller')
const isAuth = require('../middleware/is-auth')

// INDEX /feed/posts
router.get('/posts', isAuth, feedController.indexPosts)
// SHOW /feed/post/:id
router.get('/post/:id', isAuth, feedController.showPost)
// CREATE /feed/post
router.post('/post', isAuth, [
  body('title').trim().isLength({min: 5}),
  body('content').trim().isLength({min: 5})
], feedController.createPost)
// UPDATE /feed/post/:id
router.put('/post/:id', isAuth, feedController.updatePost)
router.delete('/post/:id', isAuth, feedController.deletePost)


module.exports = router;