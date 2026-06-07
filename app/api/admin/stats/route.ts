import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSql } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const totalSessions = await getSql()('SELECT COUNT(*) as count FROM sessions WHERE completed = true');
  const totalMinutes = await getSql()('SELECT COALESCE(SUM(total_duration), 0) as minutes FROM sessions WHERE completed = true');

  return NextResponse.json({
    totalSessions: totalSessions[0]?.count || 0,
    totalMinutes: Math.round((totalMinutes[0]?.minutes || 0) / 60),
  });
}