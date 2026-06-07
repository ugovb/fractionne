type TimerListener = {
  tick?: (data: { phase: string; timeRemaining: number; cycle: number; totalCycles: number }) => void;
  phasechange?: (data: { phase: string; cycle: number }) => void;
  complete?: () => void;
};

export class WorkoutTimer {
  private workout: any;
  private phase: string = 'idle';
  private cycle: number = 0;
  private phaseStartTime: number = 0;
  private phaseDuration: number = 0;
  private pausedElapsed: number = 0;
  private tickInterval: any = null;
  private listeners: TimerListener = {};

  constructor(workout: any) {
    this.workout = workout;
  }

  on(event: string, callback: any) {
    if (event === 'tick') this.listeners.tick = callback;
    if (event === 'phasechange') this.listeners.phasechange = callback;
    if (event === 'complete') this.listeners.complete = callback;
  }

  start() {
    this.cycle = 0;
    this.pausedElapsed = 0;
    this._startPhase('warmup', this.workout.warmUpDuration || 0);
  }

  _startPhase(phase: string, duration: number) {
    this.phase = phase;
    this.phaseDuration = duration * 1000;
    this.phaseStartTime = performance.now();
    this.listeners.phasechange?.({ phase, cycle: this.cycle });

    if (phase === 'run' || phase === 'rest') {
      this.cycle++;
      this.listeners.phasechange?.({ phase, cycle: this.cycle });
    }

    if (phase === 'complete') {
      this._stopInterval();
      this.listeners.complete?.();
      return;
    }

    this._startInterval();
  }

  _startInterval() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => this._onTick(), 100);
  }

  _stopInterval() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  _onTick() {
    if (this.phase === 'idle' || this.phase === 'paused' || this.phase === 'complete') return;

    const elapsed = this.pausedElapsed + (performance.now() - this.phaseStartTime);
    const timeRemaining = Math.max(0, Math.ceil((this.phaseDuration - elapsed) / 1000));

    this.listeners.tick?.({
      phase: this.phase,
      timeRemaining,
      cycle: this.cycle,
      totalCycles: this.workout.cycles,
    });

    if (elapsed >= this.phaseDuration) this._advancePhase();
  }

  _advancePhase() {
    this.pausedElapsed = 0;
    if (this.phase === 'warmup') {
      this.cycle = 0;
      this._startPhase('run', this.workout.runDuration);
    } else if (this.phase === 'run') {
      if (this.cycle >= this.workout.cycles) {
        this._startPhase('cooldown', this.workout.coolDownDuration || 0);
      } else {
        this._startPhase('rest', this.workout.restDuration);
      }
    } else if (this.phase === 'rest') {
      this._startPhase('run', this.workout.runDuration);
    } else if (this.phase === 'cooldown') {
      this._startPhase('complete', 0);
    }
  }

  pause() {
    if (this.phase === 'paused' || this.phase === 'idle' || this.phase === 'complete') return;
    this.pausedElapsed += performance.now() - this.phaseStartTime;
    this._stopInterval();
    this.phase = 'paused';
  }

  resume() {
    if (this.phase !== 'paused') return;
    this.phaseStartTime = performance.now();
    this.phase = 'run';
    this._startInterval();
  }

  stop() {
    this._stopInterval();
    this.phase = 'idle';
    this.cycle = 0;
    this.pausedElapsed = 0;
  }

  getElapsed(): number {
    if (this.phase === 'complete' || this.phase === 'idle') return 0;
    const currentElapsed = this.phase === 'paused' ? 0 : (performance.now() - this.phaseStartTime);
    return this.pausedElapsed + currentElapsed;
  }
}