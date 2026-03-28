const pool = require('../config/database');

const getTarefas = async (req, res) => {
  try {
    const { ativa } = req.query;
    
    let query = 'SELECT * FROM tarefas';
    let params = [];

    if (ativa !== undefined) {
      params.push(ativa === 'true');
      query += ' WHERE ativa = $1';
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

const createTarefa = async (req, res) => {
  try {
    const { tipo, descricao } = req.body;

    if (!tipo || !descricao) {
      return res.status(400).json({ error: 'Tipo e descrição são obrigatórios.' });
    }

    const validTypes = ['curtir', 'comentar', 'seguir', 'outro'];
    if (!validTypes.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de tarefa inválido.' });
    }

    const result = await pool.query(
      'INSERT INTO tarefas (tipo, descricao) VALUES ($1, $2) RETURNING *',
      [tipo, descricao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

const updateTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, descricao, ativa } = req.body;

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (tipo) {
      params.push(tipo);
      updates.push(`tipo = $${paramIndex++}`);
    }

    if (descricao) {
      params.push(descricao);
      updates.push(`descricao = $${paramIndex++}`);
    }

    if (ativa !== undefined) {
      params.push(ativa);
      updates.push(`ativa = $${paramIndex++}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
    }

    params.push(id);
    const query = `UPDATE tarefas SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

const deleteTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    res.json({ message: 'Tarefa excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
};

module.exports = { getTarefas, createTarefa, updateTarefa, deleteTarefa };
