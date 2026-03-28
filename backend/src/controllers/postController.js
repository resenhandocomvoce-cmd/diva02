const pool = require('../config/database');

const getPosts = async (req, res) => {
  try {
    const { data } = req.query;
    
    let query = `
      SELECT p.*, u.nome as usuario_nome 
      FROM posts p 
      LEFT JOIN users u ON p.usuario_id = u.id
    `;
    let params = [];

    if (data) {
      params.push(data);
      query += ` WHERE p.data = $1`;
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.nome as usuario_nome 
       FROM posts p 
       LEFT JOIN users u ON p.usuario_id = u.id 
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({ error: 'Erro ao buscar post.' });
  }
};

const createPost = async (req, res) => {
  try {
    const { link, descricao, data } = req.body;
    const usuario_id = req.user.id;

    if (!link) {
      return res.status(400).json({ error: 'Link é obrigatório.' });
    }

    const result = await pool.query(
      'INSERT INTO posts (link, usuario_id, descricao, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [link, usuario_id, descricao || null, data || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post.' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, descricao, data } = req.body;

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (link) {
      params.push(link);
      updates.push(`link = $${paramIndex++}`);
    }

    if (descricao !== undefined) {
      params.push(descricao);
      updates.push(`descricao = $${paramIndex++}`);
    }

    if (data) {
      params.push(data);
      updates.push(`data = $${paramIndex++}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
    }

    params.push(id);
    const query = `UPDATE posts SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro ao atualizar post.' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado.' });
    }

    res.json({ message: 'Post excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir post:', error);
    res.status(500).json({ error: 'Erro ao excluir post.' });
  }
};

const getPostsWithConclusoes = async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    
    const posts = await pool.query(
      `SELECT p.*, u.nome as usuario_nome 
       FROM posts p 
       LEFT JOIN users u ON p.usuario_id = u.id
       WHERE p.data = $1
       ORDER BY p.created_at DESC`,
      [hoje]
    );

    const postsWithConclusoes = await Promise.all(
      posts.rows.map(async (post) => {
        const conclusoes = await pool.query(
          `SELECT c.*, us.nome as usuario_nome 
           FROM conclusoes c 
           LEFT JOIN users us ON c.usuario_id = us.id
           WHERE c.post_id = $1`,
          [post.id]
        );
        return { ...post, conclusoes: conclusoes.rows };
      })
    );

    res.json(postsWithConclusoes);
  } catch (error) {
    console.error('Erro ao buscar posts com conclusões:', error);
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost, getPostsWithConclusoes };
