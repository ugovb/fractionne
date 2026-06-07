'use client';
import { useEffect, useState } from 'react';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#888', marginBottom: '24px' }}>ALL ATHLETES STATS</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#0D0D0D', border: '1px solid #2A2A2A' }}>
          <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em' }}>TOTAL SESSIONS</div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.totalSessions || 0}</div>
        </div>
        <div style={{ padding: '16px', background: '#0D0D0D', border: '1px solid #2A2A2A' }}>
          <div style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em' }}>TOTAL MINUTES</div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>{stats.totalMinutes || 0}</div>
        </div>
      </div>
    </div>
  );
}