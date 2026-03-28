import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM tarefas ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar tarefas.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tipo, descricao } = body;
    const result = await pool.query(
      'INSERT INTO tarefas (tipo, descricao) VALUES ($1, $2) RETURNING *',
      [tipo, descricao]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar tarefa.' }, { status: 500 });
  }
}
