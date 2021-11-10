const express = require('express');
const { Authenticate } = require('../auth');
const {
	createPost,
	getPosts,
	editPost,
	getPost,
	deletePost,
} = require('../contollers/postController');
const router = express.Router();

router.post('/', createPost);
router.get('/', [Authenticate], getPosts);
router.put('/:id', [Authenticate], editPost);
router.get('/:id', [Authenticate], getPost);
router.delete('/:id', [Authenticate], deletePost);

module.exports = router;
