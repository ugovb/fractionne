'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function SessionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('workoutId');
  const profileId = searchParams.get('profileId');
  const [phase, setPhase] = useState('idle');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!session) router.push('/login');
  }, [session, router]);

  useEffect(() => {
    if (workoutId === 'new' && profileId) {
      const workout = { cycles: 8, runDuration: 120, restDuration: 30, warmUpDuration: 0, coolDownDuration: 0 };
      setTotalCycles(workout.cycles);
      startTimer(workout);
    } else if (workoutId) {
      fetch(`/api/workouts?profileId=${profileId}`).then(r => r.json()).then(workouts => {
        const w = workouts.find((x: any) => x.id === workoutId);
        if (w) {
          setTotalCycles(w.cycles);
          startTimer(w);
        }
      });
    }
  }, [workoutId, profileId]);

  const startTimer = async (workout: any) => {
    const { WorkoutTimer } = await import('@/lib/timer');
    const audio = await import('@/lib/audio');
    audio.initAudio();

    const timer = new WorkoutTimer(workout);
    timerRef.current = timer;

    timer.on('phasechange', (data: any) => {
      setPhase(data.phase);
      if (data.phase === 'run') audio.playRunTone();
      else if (data.phase === 'rest') audio.playWalkTone();
      else if (data.phase === 'complete') {
        audio.playEndTone();
        saveSession(workout, data);
        router.push('/app/complete');
      }
    });

    timer.on('tick', (data: any) => {
      setTimeRemaining(data.timeRemaining);
      setCycle(data.cycle);
    });

    timer.start();
  };

  const saveSession = async (workout: any, data: any) => {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workoutId: workoutId === 'new' ? null : workoutId,
        profileId,
        totalDuration: data.totalDuration || 0,
        cyclesCompleted: data.cycle || 0,
        workoutDuration: workout.cycles * (workout.runDuration + workout.restDuration),
        completed: true,
      }),
    });
  };

  const togglePause = () => {
    if (timerRef.current) {
      if (isPaused) timerRef.current.resume();
      else timerRef.current.pause();
      setIsPaused(!isPaused);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      const elapsed = timerRef.current.getElapsed?.() || 0;
      timerRef.current.stop();
      if (elapsed > 5) {
        saveSession(null, { cycle: cycle, totalDuration: elapsed, completed: false });
      }
    }
    router.push('/app');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const phaseColor = phase === 'run' ? '#FF2D00' : phase === 'rest' ? '#FFE500' : phase === 'warmup' ? '#00CCFF' : '#AAFF00';

  const progress = totalCycles > 0 ? (cycle / totalCycles) * 100 : 0;

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono, monospace', gap: '24px', padding: '40px 24px' }}>
      <div style={{ fontSize: 'clamp(56px, 20vw, 96px)', fontWeight: 700, letterSpacing: '0.05em', color: phaseColor }}>{phase.toUpperCase()}</div>
      <div style={{ fontSize: 'clamp(72px, 28vw, 140px)', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatTime(timeRemaining)}</div>
      <div style={{ width: '100%', maxWidth: 400, height: 4, background: '#1A1A1A', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#FF2D00', width: `${progress}%`, transition: 'width 200ms linear' }} />
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.2em', color: '#888' }}>{cycle} OF {totalCycles}</div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
        <button onClick={togglePause} style={{ width: 100, height: 100, background: 'none', border: '2px solid #444', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          {isPaused ? <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M8 5L22 14L8 23V5Z" fill="currentColor"/></svg> : <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="5" width="6" height="18" rx="1" fill="currentColor"/><rect x="16" y="5" width="6" height="18" rx="1" fill="currentColor"/></svg>}
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>{isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>
        <button onClick={stopTimer} style={{ width: 100, height: 100, background: 'none', border: '2px solid #444', color: '#888', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="14" rx="1" fill="currentColor"/></svg>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>STOP</span>
        </button>
      </div>
    </div>
  );
}