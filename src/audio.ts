
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export function playBounceSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

export function playGameOverSound() {
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  
  osc1.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc2.frequency.setValueAtTime(150, audioCtx.currentTime);
  
  osc1.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.5);
  osc2.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);
  
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc1.start();
  osc2.start();
  osc1.stop(audioCtx.currentTime + 0.5);
  osc2.stop(audioCtx.currentTime + 0.5);
}
