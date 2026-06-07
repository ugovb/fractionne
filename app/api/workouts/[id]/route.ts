import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, cycles, runDuration, restDuration, warmUpDuration, coolDownDuration } = await req.json();

  const result = await sql(
    `UPDATE workouts SET name = $1, cycles = $2, run_duration = $3, rest_duration = $4, warm_up_duration = $5, cool_down_duration = $6
     WHERE id = $7 RETURNING *`,
    [name, cycles, runDuration, restDuration, warmUpDuration || 0, coolDownDuration || 0, params.id]
  );

  if (result.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await sql('DELETE FROM workouts WHERE id = $1', [params.id]);
  return NextResponse.json({ success: true });
}