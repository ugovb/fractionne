import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSql } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profiles = session.user.role === 'admin'
    ? await getSql()('SELECT * FROM profiles ORDER BY created_at DESC')
    : await getSql()('SELECT * FROM profiles WHERE user_id = $1 ORDER BY created_at DESC', [session.user.id]);

  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, color } = await req.json();
  if (!name || !color) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const result = await getSql()(
    'INSERT INTO profiles (user_id, name, color) VALUES ($1, $2, $3) RETURNING *',
    [session.user.id, name, color]
  );

  return NextResponse.json(result[0], { status: 201 });
}