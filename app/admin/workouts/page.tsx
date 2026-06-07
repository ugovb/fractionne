'use client';
import { useEffect, useState } from 'react';

interface Workout {
  id: string;
  name: string;
  cycles: number;
  profile_id: string;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    fetch('/api/admin/workouts').then(r => r.json()).then(setWorkouts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workout?')) return;
    await fetch(`/api/admin/workouts/${id}`, { method: 'DELETE' });
    fetch('/api/admin/workouts').then(r => r.json()).then(setWorkouts);
  };

  return (
    <div>
      <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#888', marginBottom: '24px' }}>WORKOUTS</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {workouts.map(workout => (
          <div key={workout.id} style={{ padding: '16px', background: '#0D0D0D', border: '1px solid #2A2A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{workout.name}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{workout.cycles} cycles</div>
            </div>
            <button onClick={() => handleDelete(workout.id)} style={{ padding: '4px 8px', background: 'none', border: '1px solid #FF2D00', color: '#FF2D00', fontSize: '10px', cursor: 'pointer' }}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}