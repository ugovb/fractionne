'use client';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password_encrypted: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      role: (form.elements.namedItem('role') as HTMLSelectElement).value,
    };
    await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setShowForm(false);
    fetch('/api/users').then(r => r.json()).then(setUsers);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetch('/api/users').then(r => r.json()).then(setUsers);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#888' }}>USERS</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #444', color: '#fff', fontSize: '11px', cursor: 'pointer' }}>+ ADD USER</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #444' }}>
          <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
            <input name="email" type="email" placeholder="Email" required style={{ padding: '8px', background: '#0D0D0D', border: '1px solid #444', color: '#fff' }} />
            <input name="password" type="password" placeholder="Password" required style={{ padding: '8px', background: '#0D0D0D', border: '1px solid #444', color: '#fff' }} />
            <input name="name" type="text" placeholder="Name" required style={{ padding: '8px', background: '#0D0D0D', border: '1px solid #444', color: '#fff' }} />
            <select name="role" style={{ padding: '8px', background: '#0D0D0D', border: '1px solid #444', color: '#fff' }}>
              <option value="athlete">Athlete</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '12px', padding: '8px 16px', background: '#fff', border: 'none', color: '#000', fontWeight: 700, cursor: 'pointer' }}>CREATE</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {users.map(user => (
          <div key={user.id} style={{ padding: '16px', background: '#0D0D0D', border: '1px solid #2A2A2A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>{user.email}</div>
              <span style={{ fontSize: '10px', padding: '2px 6px', background: user.role === 'admin' ? '#FF2D00' : '#444', marginTop: '4px', display: 'inline-block' }}>{user.role.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleDelete(user.id)} style={{ padding: '4px 8px', background: 'none', border: '1px solid #FF2D00', color: '#FF2D00', fontSize: '10px', cursor: 'pointer' }}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}