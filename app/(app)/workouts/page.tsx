'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Workout {
  id: string;
  name: string;
  cycles: number;
  runDuration: number;
  restDuration: number;
}

export default function WorkoutsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get('profileId');
  const isNew = searchParams.get('new') === 'true';
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    if (isNew && !profileId) {
      const name = prompt('Profile name:');
      if (name) {
        fetch('/api/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, color: '#FF2D00' }) })
          .then(r => r.json())
          .then(p => router.push(`/app/workouts?profileId=${p.id}`));
      } else {
        router.push('/app');
      }
    }
  }, [isNew, profileId, router]);

  useEffect(() => {
    if (profileId) {
      fetch(`/api/workouts?profileId=${profileId}`).then(r => r.json()).then(setWorkouts);
      fetch('/api/profiles').then(r => r.json()).then(profiles => {
        const p = profiles.find((x: any) => x.id === profileId);
        if (p) setProfileName(p.name);
      });
    }
  }, [profileId]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalDuration = (w: Workout) => (w.runDuration + w.restDuration) * w.cycles;

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', fontFamily: 'IBM Plex Mono, monospace' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.push('/app')} style={{ background: 'none', border: 'none', color: '#888', fontSize: '11px', cursor: 'pointer' }}>← BACK</button>
        <h1 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em' }}>{profileName.toUpperCase()}</h1>
      </header>
      <div style={{ padding: '16px 0' }}>
        {workouts.map(workout => (
          <div key={workout.id} style={{ padding: '24px', borderBottom: '1px solid #2A2A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em' }}>{workout.name}</div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: 4 }}>{formatDuration(totalDuration(workout))} · {workout.cycles} cycles</div>
            </div>
            <button
              onClick={() => router.push(`/app/session/${workout.id}?profileId=${profileId}`)}
              style={{ padding: '8px 16px', background: '#FF2D00', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer' }}
            >
              LANCER
            </button>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px' }}>
        <button
          onClick={() => router.push(`/app/session/new?profileId=${profileId}`)}
          style={{ width: '100%', padding: '24px', background: '#fff', border: '2px solid #fff', color: '#000', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer' }}
        >
          AJOUTER WORKOUT
        </button>
      </div>
    </div>
  );
}