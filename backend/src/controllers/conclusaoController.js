const pool = require('../config/database');

const completeTask = async (req, res) => {
  try {
    const { tarefa_id, post_id } = req.body;
    const usuario_id = req.user.id;

    if (!tarefa_id) {
      return res.status(400).json({ error: 'ID da tarefa é obrigatório.' });
    }

    const tarefa = await pool.query('SELECT * FROM tarefas WHERE id = $1', [tarefa_id]);
    if (tarefa.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    const existingConclusao = await pool.query(
      'SELECT * FROM conclusoes WHERE usuario_id = $1 AND tarefa_id = $2',
      [usuario_id, tarefa_id]
    );

    if (existingConclusao.rows.length > 0) {
      await pool.query(
        'UPDATE conclusoes SET status = $1, created_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['concluida', existingConclusao.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO conclusoes (usuario_id, tarefa_id, post_id, status) VALUES ($1, $2, $3, $4)',
        [usuario_id, tarefa_id, post_id || null, 'concluida']
      );
    }

    res.json({ message: 'Tarefa marcada como concluída!' });
  } catch (error) {
    console.error('Erro ao completar tarefa:', error);
    res.status(500).json({ error: 'Erro ao completar tarefa.' });
  }
};

const getConclusoesByUser = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, t.tipo, t.descricao, p.link as post_link 
       FROM conclusoes c 
       LEFT JOIN tarefas t ON c.tarefa_id = t.id 
       LEFT JOIN posts p ON c.post_id = p.id
       WHERE c.usuario_id = $1
       ORDER BY c.created_at DESC`,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar conclusões:', error);
    res.status(500).json({ error: 'Erro ao buscar conclusões.' });
  }
};

const getConclusoesByPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    
    const result = await pool.query(
      `SELECT c.*, u.nome as usuario_nome, u.foto_perfil 
       FROM conclusoes c 
       LEFT JOIN users u ON c.usuario_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [post_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar conclusões:', error);
    res.status(500).json({ error: 'Erro ao buscar conclusões.' });
  }
};

const verificarConclusao = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['pendente', 'concluida', 'verificada'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const result = await pool.query(
      'UPDATE conclusoes SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conclusão não encontrada.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao verificar conclusão:', error);
    res.status(500).json({ error: 'Erro ao verificar conclusão.' });
  }
};

const getTodayProgress = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const hoje = new Date().toISOString().split('T')[0];

    const tarefas = await pool.query('SELECT * FROM tarefas WHERE ativa = true');
    
    const conclusoes = await pool.query(
      `SELECT c.*, t.tipo, t.descricao 
       FROM conclusoes c 
       LEFT JOIN tarefas t ON c.tarefa_id = t.id
       WHERE c.usuario_id = $1 AND DATE(c.created_at) = $2`,
      [usuario_id, hoje]
    );

    const totalTarefas = tarefas.rows.length;
    const tarefasConcluidas = conclusoes.rows.filter(c => c.status === 'concluida' || c.status === 'verificada').length;

    res.json({
      totalTarefas,
      tarefasConcluidas,
      tarefasPendentes: totalTarefas - tarefasConcluidas,
      conclusoes: conclusoes.rows
    });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).json({ error: 'Erro ao buscar progresso.' });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    const conclusoes = await pool.query(
      `SELECT c.*, t.tipo, t.descricao 
       FROM conclusoes c 
       LEFT JOIN tarefas t ON c.tarefa_id = t.id
       WHERE c.usuario_id = $1
       ORDER BY c.created_at DESC
       LIMIT 50`,
      [usuario_id]
    );

    const atividades = await pool.query(
      'SELECT * FROM atividades WHERE usuario_id = $1 ORDER BY created_at DESC LIMIT 20',
      [usuario_id]
    );

    res.json({
      conclusoes: conclusoes.rows,
      atividades: atividades.rows
    });
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);
    res.status(500).json({ error: 'Erro ao buscar atividade.' });
  }
};

module.exports = { 
  completeTask, 
  getConclusoesByUser, 
  getConclusoesByPost, 
  verificarConclusao, 
  getTodayProgress,
  getUserActivity 
};
