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
  const [showCreate, setShowCreate] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: '', cycles: 8, runDuration: 120, restDuration: 30 });

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

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newWorkout, profileId }),
    });
    if (res.ok) {
      setShowCreate(false);
      setNewWorkout({ name: '', cycles: 8, runDuration: 120, restDuration: 30 });
      fetch(`/api/workouts?profileId=${profileId}`).then(r => r.json()).then(setWorkouts);
    }
  };

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

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 100 }}>
          <form onSubmit={handleCreateWorkout} style={{ background: '#111', border: '1px solid #333', padding: '24px', width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', marginBottom: '24px' }}>NEW WORKOUT</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Workout name"
                value={newWorkout.name}
                onChange={e => setNewWorkout({ ...newWorkout, name: e.target.value })}
                required
                style={{ padding: '12px', background: '#000', border: '1px solid #333', color: '#fff', fontSize: '14px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#888' }}>CYCLES</label>
                  <input
                    type="number"
                    min={1}
                    value={newWorkout.cycles}
                    onChange={e => setNewWorkout({ ...newWorkout, cycles: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', fontSize: '14px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: '#888' }}>RUN (sec)</label>
                  <input
                    type="number"
                    min={10}
                    value={newWorkout.runDuration}
                    onChange={e => setNewWorkout({ ...newWorkout, runDuration: parseInt(e.target.value) || 60 })}
                    style={{ width: '100%', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', fontSize: '14px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: '#888' }}>REST (sec)</label>
                  <input
                    type="number"
                    min={5}
                    value={newWorkout.restDuration}
                    onChange={e => setNewWorkout({ ...newWorkout, restDuration: parseInt(e.target.value) || 30 })}
                    style={{ width: '100%', padding: '8px', background: '#000', border: '1px solid #333', color: '#fff', fontSize: '14px', marginTop: '4px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '12px', background: 'none', border: '1px solid #444', color: '#888', cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#fff', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer' }}>CREATE</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div style={{ padding: '24px' }}>
        <button
          onClick={() => setShowCreate(true)}
          style={{ width: '100%', padding: '24px', background: '#fff', border: '2px solid #fff', color: '#000', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer' }}
        >
          AJOUTER WORKOUT
        </button>
      </div>
    </div>
  );
}