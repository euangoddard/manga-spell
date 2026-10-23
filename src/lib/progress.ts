import { PATTERNS } from "~/data/patterns";
import { WORD_SETS, type Entry, type SetId } from "~/data/words";

/** One time a word was tested */
export interface Go {
  /** When it happened */
  t: number;
  /** Tries used, 1–3 */
  n: number;
  /** Spelled correctly in the end */
  ok: boolean;
}

export interface EntryStats {
  /** The last few goes, oldest first */
  goes: Go[];
  /** Per form: how often each letter went wrong */
  letters: Record<string, number[]>;
}

export interface Progress {
  entries: Record<string, EntryStats>;
  power: number;
  stickers: number;
}

const KEY = "manga-spell:progress";
const KEEP_GOES = 5;

const empty = (): Progress => ({ entries: {}, power: 0, stickers: 0 });

export const loadProgress = (): Progress => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
};

const save = (p: Progress) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage full or blocked: progress for this session only
  }
};

const statsFor = (p: Progress, id: string): EntryStats =>
  (p.entries[id] ??= { goes: [], letters: {} });

/** Records which letters of a form were wrong on a single try */
export const recordMiss = (entryId: string, form: string, missed: number[]) => {
  const p = loadProgress();
  const s = statsFor(p, entryId);
  const counts = (s.letters[form] ??= Array.from({ length: form.length }, () => 0));
  for (const i of missed) if (i < counts.length) counts[i]++;
  save(p);
};

/** Records a finished word and returns the updated totals */
export const recordGo = (entryId: string, go: Go, power: number, sticker: boolean) => {
  const p = loadProgress();
  const s = statsFor(p, entryId);
  s.goes = [...s.goes, go].slice(-KEEP_GOES);
  p.power += power;
  if (sticker) p.stickers++;
  save(p);
  return p;
};

/** 0 (got it every time) … 4 (needs practice), or -1 if never tried */
export const entryLevel = (s: EntryStats | undefined): number => {
  if (!s || s.goes.length === 0) return -1;
  const misses = s.goes.filter((g) => !g.ok || g.n > 1).length;
  return Math.min(4, misses);
};

/** Heat level of a single go */
export const goLevel = (g: Go): number => (!g.ok ? 4 : g.n === 1 ? 0 : g.n === 2 ? 2 : 3);

export const missedCount = (s: EntryStats | undefined) =>
  s ? s.goes.filter((g) => !g.ok || g.n > 1).length : 0;

/** Letter heat for the form that has gone wrong most often */
export const letterHeat = (entry: Entry, s: EntryStats | undefined) => {
  let form = entry.forms[0].word;
  let counts: number[] = [];
  let worst = -1;
  for (const f of entry.forms) {
    const c = s?.letters[f.word] ?? [];
    const total = c.reduce((a, b) => a + b, 0);
    if (total > worst) {
      worst = total;
      form = f.word;
      counts = c;
    }
  }
  const max = Math.max(0, ...counts);
  return form.split("").map((ch, i) => {
    const c = counts[i] ?? 0;
    return { ch, level: c === 0 || max === 0 ? 0 : Math.max(1, Math.ceil((c / max) * 4)) };
  });
};

export interface PatternSummary {
  name: string;
  examples: string[];
  /** Up to five most recent go levels, oldest first; null when untried */
  cells: (number | null)[];
  score: number;
  count: number;
}

export const patternSummaries = (setId: SetId, p: Progress): PatternSummary[] => {
  const entries = WORD_SETS[setId];
  return PATTERNS.map((pattern, order) => {
    const matching = entries.filter((e) => e.forms.some((f) => pattern.test(f.word)));
    const goes = matching
      .flatMap((e) => p.entries[e.id]?.goes ?? [])
      .sort((a, b) => a.t - b.t)
      .slice(-KEEP_GOES);
    const levels = goes.map(goLevel);
    const examples = [...matching]
      .sort((a, b) => entryLevel(p.entries[b.id]) - entryLevel(p.entries[a.id]))
      .slice(0, 2)
      .map((e) => e.forms.find((f) => pattern.test(f.word))!.word);
    return {
      name: pattern.name,
      examples,
      cells: [...Array.from({ length: KEEP_GOES - levels.length }, () => null), ...levels],
      // Weakest first; untried patterns keep their natural order
      score: levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length + 10 : -order,
      count: matching.length,
    };
  })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
};

export interface Rank {
  name: string;
  next: string | null;
  /** 0–100 towards the next rank */
  pct: number;
}

const RANKS: [string, number][] = [
  ["C", 0],
  ["B", 300],
  ["A", 900],
  ["S", 2000],
  ["SS", 4000],
];

export const rankFor = (power: number): Rank => {
  let i = 0;
  while (i < RANKS.length - 1 && power >= RANKS[i + 1][1]) i++;
  const [name, from] = RANKS[i];
  const next = RANKS[i + 1];
  return {
    name,
    next: next ? next[0] : null,
    pct: next ? Math.round(((power - from) / (next[1] - from)) * 100) : 100,
  };
};

/** Picks a round, favouring untried and weak words */
export const pickRound = (setId: SetId, size: number, focusWeak: boolean): Entry[] => {
  const p = loadProgress();
  const entries = WORD_SETS[setId];
  if (focusWeak) {
    const weak = entries
      .map((e) => ({ e, lv: entryLevel(p.entries[e.id]) }))
      .filter((x) => x.lv >= 1)
      .sort((a, b) => b.lv - a.lv || Math.random() - 0.5)
      .slice(0, size)
      .map((x) => x.e);
    if (weak.length >= size) return weak;
    const rest = pickWeighted(entries.filter((e) => !weak.includes(e)), p, size - weak.length);
    return [...weak, ...rest];
  }
  return pickWeighted(entries, p, size);
};

const pickWeighted = (pool: Entry[], p: Progress, size: number): Entry[] => {
  const items = pool.map((e) => {
    const lv = entryLevel(p.entries[e.id]);
    return { e, w: lv < 0 ? 3 : 1 + lv * 2 };
  });
  const out: Entry[] = [];
  while (out.length < size && items.length) {
    const total = items.reduce((a, b) => a + b.w, 0);
    let r = Math.random() * total;
    const idx = items.findIndex((x) => (r -= x.w) <= 0);
    out.push(items.splice(idx < 0 ? items.length - 1 : idx, 1)[0].e);
  }
  return out;
};
