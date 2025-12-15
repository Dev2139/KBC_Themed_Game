// Sound effects hook using Web Audio API
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log('Sound not supported');
  }
};

export const useSound = () => {
  const playCorrectSound = () => {
    // Happy ascending melody
    playTone(523.25, 0.15, 'sine', 0.4); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.4), 100); // E5
    setTimeout(() => playTone(783.99, 0.15, 'sine', 0.4), 200); // G5
    setTimeout(() => playTone(1046.50, 0.3, 'sine', 0.5), 300); // C6
  };

  const playWrongSound = () => {
    // Sad descending tones
    playTone(311.13, 0.3, 'sawtooth', 0.2); // Eb4
    setTimeout(() => playTone(233.08, 0.4, 'sawtooth', 0.2), 200); // Bb3
  };

  const playSelectSound = () => {
    // Click/select sound
    playTone(800, 0.08, 'sine', 0.2);
  };

  const playLockSound = () => {
    // Dramatic lock sound
    playTone(200, 0.1, 'square', 0.15);
    setTimeout(() => playTone(300, 0.1, 'square', 0.15), 100);
    setTimeout(() => playTone(400, 0.2, 'square', 0.2), 200);
  };

  const playWinSound = () => {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.4), i * 150);
    });
  };

  const playGameOverSound = () => {
    // Game over sound
    playTone(392, 0.3, 'triangle', 0.3);
    setTimeout(() => playTone(349.23, 0.3, 'triangle', 0.3), 300);
    setTimeout(() => playTone(329.63, 0.3, 'triangle', 0.3), 600);
    setTimeout(() => playTone(261.63, 0.5, 'triangle', 0.3), 900);
  };

  const playTickSound = () => {
    playTone(1000, 0.05, 'sine', 0.1);
  };

  return {
    playCorrectSound,
    playWrongSound,
    playSelectSound,
    playLockSound,
    playWinSound,
    playGameOverSound,
    playTickSound,
  };
};
