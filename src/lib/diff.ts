export type Op =
  | { kind: "same"; a: number; w: number }
  | { kind: "swap"; a: number; w: number }
  | { kind: "extra"; a: number }
  | { kind: "missing"; w: number; a: number };

/** Aligns an attempt against the target with a Levenshtein backtrace */
export const align = (attempt: string, target: string): Op[] => {
  const a = attempt.toLowerCase();
  const t = target.toLowerCase();
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: t.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === t[j - 1] ? 0 : 1),
      );
    }
  }
  const ops: Op[] = [];
  let i = a.length;
  let j = t.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === t[j - 1] ? 0 : 1)) {
      ops.push({ kind: a[i - 1] === t[j - 1] ? "same" : "swap", a: i - 1, w: j - 1 });
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      ops.push({ kind: "extra", a: i - 1 });
      i--;
    } else {
      ops.push({ kind: "missing", w: j - 1, a: i });
      j--;
    }
  }
  return ops.reverse();
};

export interface Feedback {
  /** Indexes of the attempt's letters to highlight */
  hot: number[];
  /** Indexes of the target's letters that went wrong, for the heat map */
  missed: number[];
  /** First mistake, used to write a hint */
  first: Op | null;
}

export const feedback = (attempt: string, target: string): Feedback => {
  const ops = align(attempt, target);
  const hot = new Set<number>();
  const missed = new Set<number>();
  let first: Op | null = null;
  for (const op of ops) {
    if (op.kind === "same") continue;
    first ??= op;
    if (op.kind === "swap") {
      hot.add(op.a);
      missed.add(op.w);
    } else if (op.kind === "extra") {
      hot.add(op.a);
      const next = ops.find((o) => "w" in o && o.kind !== "missing" && o.a > op.a);
      missed.add(next && "w" in next ? next.w : target.length - 1);
    } else {
      // Highlight the letters either side of the gap
      if (op.a > 0) hot.add(op.a - 1);
      if (op.a < attempt.length) hot.add(op.a);
      missed.add(op.w);
    }
  }
  return { hot: [...hot].sort((x, y) => x - y), missed: [...missed], first };
};
