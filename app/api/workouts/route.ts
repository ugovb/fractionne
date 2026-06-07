import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profileId = req.nextUrl.searchParams.get('profileId');
  if (!profileId) return NextResponse.json({ error: 'profileId required' }, { status: 400 });

  const workouts = await sql(
    'SELECT * FROM workouts WHERE profile_id = $1 ORDER BY created_at DESC',
    [profileId]
  );

  return NextResponse.json(workouts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { profileId, name, cycles, runDuration, restDuration, warmUpDuration, coolDownDuration } = await req.json();

  const result = await sql(
    `INSERT INTO workouts (profile_id, name, cycles, run_duration, rest_duration, warm_up_duration, cool_down_duration)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [profileId, name, cycles, runDuration, restDuration, warmUpDuration || 0, coolDownDuration || 0]
  );

  return NextResponse.json(result[0], { status: 201 });
}