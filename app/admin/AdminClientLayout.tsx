'use client';
import { useRouter } from 'next/navigation';

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', fontFamily: 'IBM Plex Mono, monospace' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/app')} style={{ background: 'none', border: 'none', color: '#888', fontSize: '11px', cursor: 'pointer' }}>← BACK</button>
        <h1 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em' }}>ADMIN PANEL</h1>
      </header>
      <nav style={{ display: 'flex', borderBottom: '1px solid #2A2A2A' }}>
        {['users', 'profiles', 'workouts', 'stats'].map(item => (
          <button
            key={item}
            onClick={() => router.push(`/admin/${item}`)}
            style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: '2px solid transparent', color: '#888', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {item}
          </button>
        ))}
      </nav>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}