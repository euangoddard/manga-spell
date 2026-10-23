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

export const speak = async (text: string, rate = 0.9): Promise<void> => {
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
