const express = require('express')
const router = express.Router();
const { body } = require('express-validator')

const feedController = require('../controllers/feeds_controller')

// INDEX /feed/posts
router.get('/posts', feedController.indexPosts)
// SHOW /feed/post/:id
router.get('/post/:id', feedController.showPost)
// CREATE /feed/post
router.post('/post', [
  body('title').trim().isLength({min: 5}),
  body('content').trim().isLength({min: 5})
], feedController.createPost)
// UPDATE /feed/post/:id
router.put('/post/:id', feedController.updatePost)
router.delete('/post/:id', feedController.deletePost)


module.exports = router;