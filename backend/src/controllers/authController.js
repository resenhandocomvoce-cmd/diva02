const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
  try {
    const { nome, email, whatsapp, senha, foto_perfil } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO users (nome, email, whatsapp, senha, foto_perfil, tipo, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nome, email, whatsapp, foto_perfil, tipo, status, created_at`,
      [nome, email, whatsapp || null, hashedSenha, foto_perfil || null, 'user', 'pendente']
    );

    const token = jwt.sign(
      { id: result.rows[0].id, tipo: result.rows[0].tipo, email: result.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Cadastro realizado com sucesso! Aguarde aprovação.',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao realizar cadastro.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    const user = result.rows[0];
    const validSenha = await bcrypt.compare(senha, user.senha);

    if (!validSenha) {
      return res.status(401).json({ error: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        whatsapp: user.whatsapp,
        foto_perfil: user.foto_perfil,
        tipo: user.tipo,
        status: user.status,
        penalidades: user.penalidades
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
};

module.exports = { register, login };
