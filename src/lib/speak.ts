import type { Word } from "~/data/words";
import { audioName, type Clip } from "./audio";

type VoicePredicate = (v: SpeechSynthesisVoice) => boolean;

// Prefer a British voice: cloud en-GB → known good local en-GB voices → any en-GB
const PRIORITIES: VoicePredicate[] = [
  (v) => !v.localService && v.lang === "en-GB",
  (v) => v.name.includes("Serena") && v.lang === "en-GB",
  (v) => v.name.includes("Kate") && v.lang === "en-GB",
  (v) => v.name.includes("Daniel") && v.lang === "en-GB",
  (v) => v.localService && v.lang === "en-GB",
  (v) => v.lang.startsWith("en-GB"),
  (v) => v.lang.startsWith("en"),
];

const pickVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  for (const test of PRIORITIES) {
    const match = voices.find(test);
    if (match) return match;
  }
  return voices[0] ?? null;
};

const waitForVoices = (): Promise<void> => {
  if (window.speechSynthesis.getVoices().length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    window.speechSynthesis.addEventListener("voiceschanged", () => resolve(), { once: true });
    // Some browsers never fire voiceschanged
    setTimeout(resolve, 1000);
  });
};

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

const synthesize = async (text: string, rate = 0.9): Promise<void> => {
  if (!canSpeak()) return;
  await waitForVoices();
  const synth = window.speechSynthesis;
  // Cancel anything pending: fixes Chrome's stuck-synth bug
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = rate;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
};

// One element is reused so that iOS keeps it unlocked after the first tap
let player: HTMLAudioElement | undefined;

/** Resolves true once the clip has played to the end, false if it can't play. */
const playClip = (name: string): Promise<boolean> => {
  player ??= new Audio();
  const audio = player;
  audio.src = `/audio/${name}`;
  return new Promise((resolve) => {
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.play().catch((err: unknown) => {
      // Starting another clip aborts this one: leave it unresolved so nothing follows it
      if ((err as DOMException).name !== "AbortError") resolve(false);
    });
  });
};

/** Says a word (or its slow / sentence variant) with the Polly clip, or the device voice if that fails */
export const say = async (form: Word, clip?: Clip): Promise<void> => {
  if (canSpeak()) window.speechSynthesis.cancel();
  if (await playClip(audioName(form.word, clip))) return;
  if (clip === "slow") return synthesize(form.word, 0.5);
  return synthesize(clip === "sentence" ? `${form.word}. ${form.sentence}` : form.word);
};

/** Says each word in turn, e.g. both forms of a word family */
export const sayAll = async (forms: Word[]): Promise<void> => {
  for (const form of forms) await say(form);
};
