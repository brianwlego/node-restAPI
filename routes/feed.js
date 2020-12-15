const express = require('express')
const router = express.Router();

const feedController = require('../controllers/feeds_controller')

// GET /feed/posts
router.get('/posts', feedController.getPosts)
// POST /feed/post
router.post('/post', feedController.postPost)


module.exports = router;