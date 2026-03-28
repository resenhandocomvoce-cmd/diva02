const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost, getPostsWithConclusoes } = require('../controllers/postController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getPosts);
router.get('/today', getPostsWithConclusoes);
router.get('/:id', getPostById);
router.post('/', authorizeRoles('superadmin', 'admin'), createPost);
router.put('/:id', authorizeRoles('superadmin', 'admin'), updatePost);
router.delete('/:id', authorizeRoles('superadmin', 'admin'), deletePost);

module.exports = router;
