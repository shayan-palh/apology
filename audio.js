/**
 * Web Audio API Romantic Ambient Sound Generator
 */

let audioCtx = null;
let isPlaying = false;
let masterGain = null;
let chordInterval = null;

const chords = [
  [261.63, 329.63, 392.00, 493.88],
  [220.00, 261.63, 329.63, 392.00],
  [174.61, 220.00, 261.63, 329.63],
  [196.00, 246.94, 293.66, 349.23]
];

let currentChordIndex = 0;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
}

function playChordNote(freq, delay, duration) {
  if (!audioCtx || audioCtx.state === 'suspended') return;

  const osc = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, audioCtx.currentTime + delay);

  const startTime = audioCtx.currentTime + delay;
  noteGain.gain.setValueAtTime(0, startTime);
  noteGain.gain.linearRampToValueAtTime(0.08, startTime + 1.2);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(filter);
  filter.connect(noteGain);
  noteGain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
}

function nextChord() {
  if (!isPlaying) return;

  const notes = chords[currentChordIndex];
  notes.forEach((freq, idx) => {
    playChordNote(freq, idx * 0.15, 3.5);
  });

  currentChordIndex = (currentChordIndex + 1) % chords.length;
}

export function toggleAudio() {
  initAudio();

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isPlaying) {
    isPlaying = false;
    if (chordInterval) clearInterval(chordInterval);
    if (masterGain) masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    return false;
  } else {
    isPlaying = true;
    if (masterGain) masterGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.5);
    nextChord();
    chordInterval = setInterval(nextChord, 4000);
    return true;
  }
}

export function playCelebrationChime() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
  chimeNotes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);

    const startTime = audioCtx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + 1.5);
  });
}
