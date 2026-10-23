import type { Word } from "~/data/words";
import type { Op } from "./diff";
import type { Mode } from "./settings";

const q = (s: string) => `“${s}”`;

/** Writes a gentle hint from the first mistake without giving the answer away */
export const buildHint = (word: Word, first: Op | null, attempt: string, mode: Mode): string => {
  const target = word.word.toLowerCase();
  const slowly = `Say it slowly: ${word.syllables.join("‑")}.`;
  const cool = mode === "kakkoii";
  let clue = "";
  if (first?.kind === "missing") {
    const before = target.slice(0, first.w);
    clue = before
      ? cool
        ? `A letter is missing after ${q(before)}. Find it!`
        : `A sneaky letter is hiding after the ${q(before.slice(-1))}!`
      : cool
        ? "Check the very first letter."
        : "Have another look at the start of the word!";
  } else if (first?.kind === "extra") {
    clue = cool
      ? `Drop the extra ${q(attempt[first.a] ?? "")}.`
      : `There’s an extra ${q(attempt[first.a] ?? "")} sneaking in!`;
  } else if (first?.kind === "swap") {
    const before = target.slice(0, first.w);
    clue = before
      ? cool
        ? `${q(before)} is right. The next letter isn’t.`
        : `${q(before)} is perfect! Check the letter after it.`
      : cool
        ? "The first letter is off. Listen again."
        : "Listen again to how the word starts!";
  }
  // Syllables would spell the word out, so they're only a last resort
  return [word.tip, clue].filter(Boolean).join(" ") || slowly;
};
