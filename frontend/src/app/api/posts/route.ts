export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nome as usuario_nome 
      FROM posts p 
      LEFT JOIN users u ON p.usuario_id = u.id
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar posts.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { link, descricao, data } = body;
    
    const result = await pool.query(
      'INSERT INTO posts (link, descricao, data) VALUES ($1, $2, $3) RETURNING *',
      [link, descricao, data || new Date().toISOString().split('T')[0]]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar post.' }, { status: 500 });
  }
}
