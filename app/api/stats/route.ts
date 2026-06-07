import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSql } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekMinutes = await getSql()(
    `SELECT COALESCE(SUM(total_duration), 0) as minutes FROM sessions
     WHERE user_id = $1 AND completed_at >= $2 AND completed = true`,
    [session.user.id, weekStart.toISOString()]
  );

  const totalSessions = await getSql()(
    `SELECT COUNT(*) as count FROM sessions WHERE user_id = $1 AND completed = true`,
    [session.user.id]
  );

  const totalMinutes = await getSql()(
    `SELECT COALESCE(SUM(total_duration), 0) as minutes FROM sessions WHERE user_id = $1 AND completed = true`,
    [session.user.id]
  );

  const longestSession = await getSql()(
    `SELECT COALESCE(MAX(total_duration), 0) as seconds FROM sessions WHERE user_id = $1 AND completed = true`,
    [session.user.id]
  );

  const mostUsed = await getSql()(
    `SELECT w.name, COUNT(*) as count FROM sessions s
     JOIN workouts w ON s.workout_id = w.id
     WHERE s.user_id = $1 AND s.completed = true
     GROUP BY w.name ORDER BY count DESC LIMIT 1`,
    [session.user.id]
  );

  const avgDuration = await getSql()(
    `SELECT COALESCE(AVG(total_duration), 0) as avg FROM sessions WHERE user_id = $1 AND completed = true`,
    [session.user.id]
  );

  return NextResponse.json({
    minutesThisWeek: Math.round(weekMinutes[0].minutes / 60),
    totalSessions: totalSessions[0].count,
    totalMinutes: Math.round(totalMinutes[0].minutes / 60),
    longestSession: longestSession[0].seconds,
    mostUsedWorkout: mostUsed[0]?.name || null,
    avgDuration: Math.round(avgDuration[0].avg),
  });
}