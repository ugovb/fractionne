import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { encryptPassword } from '@/lib/crypto';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await getSql()('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const encrypted = encryptPassword(password);
    const result = await getSql()(
      'INSERT INTO users (email, password_encrypted, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, encrypted, name, 'athlete']
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}