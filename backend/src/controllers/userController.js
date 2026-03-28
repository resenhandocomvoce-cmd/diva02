const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const getUsers = async (req, res) => {
  try {
    const { tipo, status } = req.query;
    
    let query = 'SELECT id, nome, email, whatsapp, foto_perfil, tipo, status, penalidades, created_at FROM users';
    let conditions = [];
    let params = [];

    if (tipo) {
      params.push(tipo);
      conditions.push(`tipo = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, nome, email, whatsapp, foto_perfil, tipo, status, penalidades, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, whatsapp, foto_perfil, status, tipo, penalidades } = req.body;

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (nome) {
      params.push(nome);
      updates.push(`nome = $${paramIndex++}`);
    }

    if (whatsapp !== undefined) {
      params.push(whatsapp);
      updates.push(`whatsapp = $${paramIndex++}`);
    }

    if (foto_perfil !== undefined) {
      params.push(foto_perfil);
      updates.push(`foto_perfil = $${paramIndex++}`);
    }

    if (status) {
      params.push(status);
      updates.push(`status = $${paramIndex++}`);
    }

    if (tipo) {
      params.push(tipo);
      updates.push(`tipo = $${paramIndex++}`);
    }

    if (penalidades !== undefined) {
      params.push(penalidades);
      updates.push(`penalidades = $${paramIndex++}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
    }

    params.push(id);
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING id, nome, email, whatsapp, foto_perfil, tipo, status, penalidades`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { senha_atual, nova_senha } = req.body;

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
    }

    const result = await pool.query('SELECT senha FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const validSenha = await bcrypt.compare(senha_atual, result.rows[0].senha);

    if (!validSenha) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    const hashedNovaSenha = await bcrypt.hash(nova_senha, 10);

    await pool.query('UPDATE users SET senha = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedNovaSenha, id]);

    res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro ao atualizar senha.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsuarios = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user'");
    const ativas = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user' AND status = 'ativa'");
    const pendentes = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user' AND status = 'pendente'");
    const inativas = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user' AND status = 'inativa'");
    const admins = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'admin' OR tipo = 'superadmin'");

    res.json({
      totalUsuarios: parseInt(totalUsuarios.rows[0].total),
      ativas: parseInt(ativas.rows[0].total),
      pendentes: parseInt(pendentes.rows[0].total),
      inativas: parseInt(inativas.rows[0].total),
      admins: parseInt(admins.rows[0].total)
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas.' });
  }
};

module.exports = { getUsers, getUserById, updateUser, updatePassword, deleteUser, getStats };
