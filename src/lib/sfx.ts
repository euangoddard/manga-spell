import type { Mode } from "./settings";

/*
 * Sound effects synthesised with the Web Audio API.
 *
 * Kawaii: soft sine and triangle tones, bubbly pops and bell-like
 * arpeggios with sparkly overtones. Nothing harsh, even when wrong.
 * Kakkoii: distorted square/saw power chords, kick-drum impacts,
 * noise "whoosh" sweeps and a doomy descending "gaan" on a miss.
 */

export type Sfx = "key" | "correct" | "incorrect" | "reveal" | "done";

declare global {
  interface Window {
    /** Created on the first tap by the boot script so iOS unlocks audio */
    __mangaAudio?: AudioContext;
  }
}

let master: GainNode | null = null;

const audio = (): AudioContext | null => {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  const ctx = (window.__mangaAudio ??= new AudioContext());
  if (ctx.state === "suspended") void ctx.resume();
  if (!master || master.context !== ctx) {
    master = ctx.createGain();
    master.gain.value = 0.5;
    const limiter = ctx.createDynamicsCompressor();
    master.connect(limiter).connect(ctx.destination);
  }
  return ctx;
};

interface ToneOpts {
  type?: OscillatorType;
  /** Seconds from now */
  at?: number;
  dur: number;
  gain: number;
  /** Glide to this frequency over the duration */
  to?: number;
  attack?: number;
  detune?: number;
  /** Optional effect chain input */
  out?: AudioNode;
}

const tone = (ctx: AudioContext, freq: number, o: ToneOpts) => {
  const t = ctx.currentTime + (o.at ?? 0);
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  if (o.detune) osc.detune.value = o.detune;
  const attack = o.attack ?? 0.005;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(o.gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  osc.connect(env).connect(o.out ?? master!);
  osc.start(t);
  osc.stop(t + o.dur + 0.05);
};

const noise = (
  ctx: AudioContext,
  o: { at?: number; dur: number; gain: number; filter: BiquadFilterType; from: number; to?: number; q?: number },
) => {
  const t = ctx.currentTime + (o.at ?? 0);
  const length = Math.ceil(ctx.sampleRate * o.dur);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = o.filter;
  filter.Q.value = o.q ?? 1;
  filter.frequency.setValueAtTime(o.from, t);
  if (o.to) filter.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  const env = ctx.createGain();
  env.gain.setValueAtTime(o.gain, t);
  env.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  src.connect(filter).connect(env).connect(master!);
  src.start(t);
};

let crunchCurve: Float32Array | null = null;

/** Waveshaper that gives Kakkoii chords their crunch */
const crunch = (ctx: AudioContext, amount = 40) => {
  if (!crunchCurve) {
    crunchCurve = new Float32Array(1024);
    for (let i = 0; i < crunchCurve.length; i++) {
      const x = (i / (crunchCurve.length - 1)) * 2 - 1;
      crunchCurve[i] = ((1 + amount) * x) / (1 + amount * Math.abs(x));
    }
  }
  const shaper = ctx.createWaveShaper();
  shaper.curve = crunchCurve;
  shaper.oversample = "2x";
  const tame = ctx.createBiquadFilter();
  tame.type = "lowpass";
  tame.frequency.value = 3200;
  shaper.connect(tame).connect(master!);
  return shaper;
};

const kick = (ctx: AudioContext, at = 0, gain = 0.9) =>
  tone(ctx, 160, { at, dur: 0.28, gain, to: 42 });

/** Bell: a fundamental plus a quiet, quickly fading octave-and-a-fifth */
const bell = (ctx: AudioContext, freq: number, at: number, dur = 0.45, gain = 0.22) => {
  tone(ctx, freq, { type: "triangle", at, dur, gain });
  tone(ctx, freq * 3, { at, dur: dur * 0.5, gain: gain * 0.25 });
};

const powerChord = (ctx: AudioContext, root: number, at: number, dur: number, gain = 0.12) => {
  const out = crunch(ctx);
  for (const [ratio, detune] of [
    [1, -6],
    [1.5, 5],
    [2, 0],
  ] as const) {
    tone(ctx, root * ratio, { type: "sawtooth", at, dur, gain, detune, attack: 0.01, out });
  }
};

// Notes
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const A5 = 880;
const C6 = 1046.5;
const E6 = 1318.5;
const G6 = 1568;
const C7 = 2093;
const PENTATONIC = [C6, 1174.7, E6, G6, 1760];
const E2 = 82.41;
const G2 = 98;
const A2 = 110;
const B2 = 123.47;

const KAWAII: Record<Sfx, (ctx: AudioContext) => void> = {
  key: (ctx) => {
    // A little bubble pop on a random pentatonic note so typing sounds musical
    const f = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    tone(ctx, f * 0.8, { dur: 0.1, gain: 0.35, to: f * 1.15 });
  },
  correct: (ctx) => {
    [C6, E6, G6, C7].forEach((f, i) => bell(ctx, f, i * 0.08));
    // Sparkle shimmer on top
    [0.32, 0.38, 0.44].forEach((at, i) => tone(ctx, 3136 + i * 400, { at, dur: 0.18, gain: 0.05 }));
  },
  incorrect: (ctx) => {
    // A gentle, sympathetic "aww": two soft descending boops
    tone(ctx, G5, { type: "triangle", dur: 0.22, gain: 0.2, to: 700 });
    tone(ctx, E5, { type: "triangle", at: 0.2, dur: 0.38, gain: 0.2, to: 440 });
  },
  reveal: (ctx) => {
    [G6, E6, C6, G5].forEach((f, i) => bell(ctx, f, i * 0.07, 0.3, 0.14));
  },
  done: (ctx) => {
    const tune: [number, number][] = [
      [C5, 0],
      [E5, 0.12],
      [G5, 0.24],
      [E5, 0.36],
      [G5, 0.48],
      [C6, 0.6],
    ];
    for (const [f, at] of tune) bell(ctx, f * 2, at, at === 0.6 ? 0.9 : 0.3, 0.2);
    [0.7, 0.8, 0.9, 1].forEach((at, i) => tone(ctx, 2637 + i * 523, { at, dur: 0.25, gain: 0.05 }));
  },
};

const KAKKOII: Record<Sfx, (ctx: AudioContext) => void> = {
  key: (ctx) => {
    // A tight mechanical "tak"
    tone(ctx, 220, { type: "square", dur: 0.045, gain: 0.25, to: 110 });
    noise(ctx, { dur: 0.035, gain: 0.35, filter: "highpass", from: 4000 });
  },
  correct: (ctx) => {
    // Impact, then a sword "shing" and a power chord
    kick(ctx);
    noise(ctx, { dur: 0.25, gain: 0.5, filter: "lowpass", from: 6000, to: 300 });
    noise(ctx, { at: 0.05, dur: 0.3, gain: 0.25, filter: "bandpass", from: 800, to: 7000, q: 6 });
    powerChord(ctx, E2 * 2, 0.08, 0.45);
  },
  incorrect: (ctx) => {
    // "Gaan": a heavy chord that sags in pitch as the filter closes
    kick(ctx, 0, 0.7);
    const out = crunch(ctx, 20);
    for (const detune of [-15, 0, 12]) {
      tone(ctx, A2 * 2, { type: "sawtooth", dur: 0.6, gain: 0.1, to: A2, detune, out });
    }
    tone(ctx, A2 / 2, { type: "square", dur: 0.55, gain: 0.12, to: A2 / 4 });
  },
  reveal: (ctx) => {
    kick(ctx, 0, 0.6);
    powerChord(ctx, G2 * 2, 0, 0.5, 0.08);
  },
  done: (ctx) => {
    // Hero fanfare: E – G – A – B power chords on the beat
    [E2, G2, A2, B2].forEach((root, i) => {
      kick(ctx, i * 0.16, 0.6);
      powerChord(ctx, root * 2, i * 0.16, i === 3 ? 0.8 : 0.15);
    });
    noise(ctx, { at: 0.48, dur: 0.6, gain: 0.25, filter: "bandpass", from: 1000, to: 8000, q: 4 });
  },
};

export const playSfx = (name: Sfx, mode: Mode) => {
  try {
    const ctx = audio();
    if (!ctx) return;
    // Kawaii is built from soft sines, so it needs more level to sit beside Kakkoii
    master!.gain.value = mode === "kawaii" ? 0.9 : 0.5;
    (mode === "kawaii" ? KAWAII : KAKKOII)[name](ctx);
  } catch {
    // Sound is a nice-to-have
  }
};

/**
 * Runs before hydration: creates the AudioContext inside the very first
 * tap or key press, which is what iOS Safari needs to allow sound.
 */
export const AUDIO_UNLOCK_SCRIPT = `(function(){function u(){try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;var c=window.__mangaAudio||(window.__mangaAudio=new C());c.resume();var b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}catch(e){}removeEventListener("pointerdown",u,true);removeEventListener("keydown",u,true)}addEventListener("pointerdown",u,true);addEventListener("keydown",u,true)})()`;
