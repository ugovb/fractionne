import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { workoutId, profileId, totalDuration, cyclesCompleted, workoutDuration, completed } = await req.json();

  const result = await sql(
    `INSERT INTO sessions (user_id, workout_id, profile_id, total_duration, cycles_completed, workout_duration, completed)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [session.user.id, workoutId, profileId, totalDuration, cyclesCompleted, workoutDuration, completed || false]
  );

  return NextResponse.json(result[0], { status: 201 });
}