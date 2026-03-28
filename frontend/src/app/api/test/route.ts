export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT id, nome, email, senha FROM users WHERE email = $1', ['admin@centraldivas.com']);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Admin não encontrado' });
    }

    return NextResponse.json({ 
      found: true,
      senha: result.rows[0].senha,
      senhaMatch: result.rows[0].senha === 'admin123'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
