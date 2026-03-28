export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Email ou senha incorretos.' }, { status: 401 });
    }

    const user = result.rows[0];
    const validSenha = await bcrypt.compare(senha, user.senha);

    if (!validSenha) {
      return NextResponse.json({ error: 'Email ou senha incorretos.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login realizado!',
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
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao fazer login.' }, { status: 500 });
  }
}
