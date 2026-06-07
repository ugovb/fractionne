let audioContext: any = null;
let masterGain: any = null;

export function initAudio() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioContext = new AudioContext();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(audioContext.destination);
    }
  }
  if (audioContext?.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playTone(frequency: number, duration: number, type = 'sine', volume = 0.3) {
  if (!audioContext) initAudio();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);
  oscillator.connect(gainNode);
  gainNode.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

export function playRunTone() {
  playTone(880, 0.3, 'square', 0.3);
  setTimeout(() => playTone(1100, 0.2, 'square', 0.3), 200);
  if ((navigator as any).vibrate) (navigator as any).vibrate(200);
}

export function playWalkTone() {
  playTone(440, 0.4, 'sine', 0.3);
  if ((navigator as any).vibrate) (navigator as any).vibrate([100, 50, 100]);
}

export function playEndTone() {
  playTone(523, 0.2, 'sine', 0.3);
  setTimeout(() => playTone(659, 0.2, 'sine', 0.3), 200);
  setTimeout(() => playTone(784, 0.4, 'sine', 0.3), 400);
  if ((navigator as any).vibrate) (navigator as any).vibrate([200, 100, 200, 100, 400]);
}