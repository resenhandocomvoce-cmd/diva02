const express = require('express');
const router = express.Router();
const { getTarefas, createTarefa, updateTarefa, deleteTarefa } = require('../controllers/tarefaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getTarefas);
router.post('/', authorizeRoles('superadmin', 'admin'), createTarefa);
router.put('/:id', authorizeRoles('superadmin', 'admin'), updateTarefa);
router.delete('/:id', authorizeRoles('superadmin', 'admin'), deleteTarefa);

module.exports = router;
