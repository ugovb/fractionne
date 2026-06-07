'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Registration failed');
      return;
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Account created but login failed. Please login manually.');
    } else {
      router.push('/app');
    }
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono, monospace', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <h1 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#888', marginBottom: '8px' }}>CREATE ACCOUNT</h1>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '32px' }}>Join Fractionné to track your interval training</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', background: '#0D0D0D', border: '1px solid #2A2A2A', color: '#fff', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', background: '#0D0D0D', border: '1px solid #2A2A2A', color: '#fff', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#888', marginBottom: '8px' }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: '100%', padding: '12px', background: '#0D0D0D', border: '1px solid #2A2A2A', color: '#fff', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="Min. 6 characters"
            />
          </div>

          {error && (
            <div style={{ padding: '12px', background: '#1A0000', border: '1px solid #FF2D00', color: '#FF2D00', fontSize: '11px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '16px', background: '#fff', border: 'none', color: '#000', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', marginTop: '8px' }}
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => router.push('/login')}
            style={{ background: 'none', border: 'none', color: '#888', fontSize: '11px', cursor: 'pointer' }}
          >
            Already have an account? LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}