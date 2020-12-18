const express = require('express')
const router = express.Router();
const { body } = require('express-validator')

const feedController = require('../controllers/feeds_controller')

// GET /feed/posts
router.get('/posts', feedController.getPosts)
// POST /feed/post
router.post('/post', [
  body('title').trim().isLength({min: 5}),
  body('content').trim().isLength({min: 5})
], feedController.postPost)


module.exports = router;