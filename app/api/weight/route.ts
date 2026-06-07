import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSql } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const entries = await getSql()(
    'SELECT * FROM weight_entries WHERE user_id = $1 ORDER BY recorded_at DESC',
    [session.user.id]
  );

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { weight, recordedAt } = await req.json();
  if (!weight) return NextResponse.json({ error: 'Weight required' }, { status: 400 });

  const result = await getSql()(
    'INSERT INTO weight_entries (user_id, weight, recorded_at) VALUES ($1, $2, $3) RETURNING *',
    [session.user.id, weight, recordedAt || new Date().toISOString().split('T')[0]]
  );

  return NextResponse.json(result[0], { status: 201 });
}