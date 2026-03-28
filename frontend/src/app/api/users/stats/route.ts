import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const total = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user'");
    const ativas = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user' AND status = 'ativa'");
    const pendentes = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user' AND status = 'pendente'");
    const inativas = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'user' AND status = 'inativa'");
    const admins = await pool.query("SELECT COUNT(*) as total FROM users WHERE tipo = 'admin' OR tipo = 'superadmin'");

    return NextResponse.json({
      totalUsuarios: parseInt(total.rows[0].total),
      ativas: parseInt(ativas.rows[0].total),
      pendentes: parseInt(pendentes.rows[0].total),
      inativas: parseInt(inativas.rows[0].total),
      admins: parseInt(admins.rows[0].total)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar estatísticas.' }, { status: 500 });
  }
}
