'use client';
import { useRouter } from 'next/navigation';

export default function CompletePage() {
  const router = useRouter();

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono, monospace', gap: '40px', padding: '40px 24px', textAlign: 'center' }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#fff" strokeWidth="2"/>
        <path d="M20 32L28 40L44 24" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h2 style={{ fontSize: 'clamp(24px, 8vw, 40px)', fontWeight: 700, letterSpacing: '0.1em' }}>SESSION COMPLETE</h2>
      <div style={{ border: '1px solid #444', padding: '24px', width: '100%', maxWidth: 280 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#888' }}>TOTAL TIME</span>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>22:40</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: '#888' }}>CYCLES</span>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>8</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <button onClick={() => router.push('/app')} style={{ width: '100%', padding: '24px', background: '#fff', border: '2px solid #fff', color: '#000', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer' }}>HOME</button>
      </div>
    </div>
  );
}