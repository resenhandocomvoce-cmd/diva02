const express = require('express');
const router = express.Router();
const { completeTask, getConclusoesByUser, getConclusoesByPost, verificarConclusao, getTodayProgress, getUserActivity } = require('../controllers/conclusaoController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/complete', completeTask);
router.get('/progress', getTodayProgress);
router.get('/user/:usuario_id', getConclusoesByUser);
router.get('/post/:post_id', getConclusoesByPost);
router.get('/activity/:usuario_id', getUserActivity);
router.put('/verify/:id', authorizeRoles('superadmin', 'admin'), verificarConclusao);

module.exports = router;
