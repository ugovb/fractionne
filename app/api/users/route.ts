import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSql } from '@/lib/db';
import { encryptPassword } from '@/lib/crypto';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await getSql()('SELECT id, email, name, role, password_encrypted, created_at FROM users ORDER BY created_at DESC');
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email, password, name, role } = await req.json();
  if (!email || !password || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const encrypted = encryptPassword(password);
  const result = await getSql()(
    'INSERT INTO users (email, password_encrypted, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
    [email, encrypted, name, role || 'athlete']
  );

  return NextResponse.json(result[0], { status: 201 });
}