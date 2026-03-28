export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

function getUserId(request: Request) {
  const auth = request.headers.get('authorization');
  const token = auth?.replace('Bearer ', '');
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserId(request);
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const body = await request.json();
    const { tarefa_id, post_id } = body;

    const existing = await pool.query(
      'SELECT * FROM conclusoes WHERE usuario_id = $1 AND tarefa_id = $2',
      [user.id, tarefa_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE conclusoes SET status = $1 WHERE id = $2',
        ['concluida', existing.rows[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO conclusoes (usuario_id, tarefa_id, post_id, status) VALUES ($1, $2, $3, $4)',
        [user.id, tarefa_id, post_id, 'concluida']
      );
    }

    return NextResponse.json({ message: 'Tarefa concluída!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao completar.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = getUserId(request);
    if (!user) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const hoje = new Date().toISOString().split('T')[0];

    const tarefas = await pool.query('SELECT * FROM tarefas WHERE ativa = true');
    const conclusoes = await pool.query(
      `SELECT c.*, t.tipo, t.descricao FROM conclusoes c 
       LEFT JOIN tarefas t ON c.tarefa_id = t.id
       WHERE c.usuario_id = $1 AND DATE(c.created_at) = $2`,
      [user.id, hoje]
    );

    const concluidas = conclusoes.rows.filter((c: any) => c.status === 'concluida' || c.status === 'verificada').length;

    return NextResponse.json({
      totalTarefas: tarefas.rows.length,
      tarefasConcluidas: concluidas,
      tarefasPendentes: tarefas.rows.length - concluidas,
      conclusoes: conclusoes.rows
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar progresso.' }, { status: 500 });
  }
}
