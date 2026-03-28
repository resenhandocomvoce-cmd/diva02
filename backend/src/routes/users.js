const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, updatePassword, deleteUser, getStats } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/stats', getStats);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/password', updatePassword);
router.delete('/:id', authorizeRoles('superadmin', 'admin'), deleteUser);

module.exports = router;
