export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, whatsapp, foto_perfil, tipo, status, penalidades, created_at FROM users WHERE id = $1',
      [params.id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuário.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { nome, whatsapp, foto_perfil, status, tipo, penalidades } = body;
    
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (nome) { updates.push(`nome = $${idx++}`); values.push(nome); }
    if (whatsapp !== undefined) { updates.push(`whatsapp = $${idx++}`); values.push(whatsapp); }
    if (foto_perfil !== undefined) { updates.push(`foto_perfil = $${idx++}`); values.push(foto_perfil); }
    if (status) { updates.push(`status = $${idx++}`); values.push(status); }
    if (tipo) { updates.push(`tipo = $${idx++}`); values.push(tipo); }
    if (penalidades !== undefined) { updates.push(`penalidades = $${idx++}`); values.push(penalidades); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 });
    }

    values.push(params.id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING id, nome, email, whatsapp, foto_perfil, tipo, status, penalidades`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [params.id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Usuário excluído.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir usuário.' }, { status: 500 });
  }
}
