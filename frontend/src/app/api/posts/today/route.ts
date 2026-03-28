export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const result = await pool.query(
      `SELECT p.*, u.nome as usuario_nome 
       FROM posts p 
       LEFT JOIN users u ON p.usuario_id = u.id
       WHERE p.data = $1
       ORDER BY p.created_at DESC`,
      [hoje]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar posts.' }, { status: 500 });
  }
}
