'use client';
import { useEffect, useState } from 'react';

interface Profile {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetch('/api/admin/profiles').then(r => r.json()).then(setProfiles);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile?')) return;
    await fetch(`/api/admin/profiles/${id}`, { method: 'DELETE' });
    fetch('/api/admin/profiles').then(r => r.json()).then(setProfiles);
  };

  return (
    <div>
      <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#888', marginBottom: '24px' }}>PROFILES</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {profiles.map(profile => (
          <div key={profile.id} style={{ padding: '16px', background: '#0D0D0D', border: '1px solid #2A2A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: profile.color }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{profile.name}</span>
            </div>
            <button onClick={() => handleDelete(profile.id)} style={{ padding: '4px 8px', background: 'none', border: '1px solid #FF2D00', color: '#FF2D00', fontSize: '10px', cursor: 'pointer' }}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}