'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Profile {
  id: string;
  name: string;
  color: string;
}

export default function AppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/profiles').then(r => r.json()).then(setProfiles);
    }
  }, [session]);

  if (status === 'loading') return <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', fontFamily: 'IBM Plex Mono, monospace' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #2A2A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em' }}>SELECT PROFIL</h1>
        {session?.user?.role === 'admin' && (
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: '1px solid #444', color: '#888', fontSize: '10px', padding: '4px 8px', cursor: 'pointer' }}>ADMIN</button>
        )}
      </header>
      <div style={{ padding: '16px 0' }}>
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => router.push(`/app/workouts?profileId=${profile.id}`)}
            style={{ width: '100%', padding: '24px', background: 'none', border: 'none', borderBottom: '1px solid #2A2A2A', color: '#fff', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: profile.color }} />
            <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.1em' }}>{profile.name}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: '24px' }}>
        <button
          onClick={() => router.push('/app/workouts?new=true')}
          style={{ width: '100%', padding: '24px', background: '#fff', border: '2px solid #fff', color: '#000', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer' }}
        >
          CRÉER MON PROFIL
        </button>
      </div>
    </div>
  );
}