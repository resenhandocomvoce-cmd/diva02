import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, whatsapp, senha } = body;

    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 400 });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO users (nome, email, whatsapp, senha, tipo, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, email, whatsapp, tipo, status`,
      [nome || email.split('@')[0], email, whatsapp || null, hashedSenha, 'user', 'pendente']
    );

    const token = jwt.sign(
      { id: result.rows[0].id, tipo: result.rows[0].tipo, email: result.rows[0].email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Cadastro realizado! Aguarde aprovação.',
      user: result.rows[0],
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao cadastrar.' }, { status: 500 });
  }
}
