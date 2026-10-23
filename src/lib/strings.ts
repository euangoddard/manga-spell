import type { Mode, Settings } from "./settings";

/** [English, katakana, English gloss shown under the katakana (defaults to English)] */
type Line = [string, string, string?];

const shared = {
  langEn: ["English", "English"],
  langKana: ["カタカナ", "カタカナ"],
  play: ["Hear it", "プレイ"],
  slow: ["Slower", "スロー"],
  sentence: ["In a sentence", "ヒント"],
  type: ["Spell it", "タイプ!", "Type the word"],
  placeholder: ["Tap the letters", "タップ!"],
  count: ["100 words", "100 ワード"],
  tap: ["Tap a square", "タップ!", "Tap a square"],
  untried: ["Not yet", "ネクスト", "Not yet"],
  hearAgain: ["Hear it", "プレイ", "Hear it again"],
  learnt: ["{n} learnt", "{n} マスター", "{n} learnt"],
} satisfies Record<string, Line>;

type Key =
  | keyof typeof shared
  | "title"
  | "hello"
  | "setTitle"
  | "styleTitle"
  | "start"
  | "map"
  | "progress"
  | "bubble"
  | "check"
  | "retryTitle"
  | "retrySub"
  | "yours"
  | "hint"
  | "retry"
  | "show"
  | "revealTitle"
  | "revealSub"
  | "next"
  | "nextLast"
  | "successTitle"
  | "secondTry"
  | "sticker"
  | "noSticker"
  | "combo"
  | "comboStart"
  | "power"
  | "doneTitle"
  | "doneSub"
  | "again"
  | "mapTitle"
  | "all"
  | "low"
  | "high"
  | "weak"
  | "weakGloss"
  | "noWeak"
  | "patterns"
  | "goes"
  | "train"
  | "rank"
  | "missedOf";

const kawaii: Record<Exclude<Key, keyof typeof shared>, Line> = {
  title: ["Manga Spelling", "マンガ スペル", "Manga Spelling"],
  hello: ["Hi, I’m Mochi! Shall we spell together?", "ハロー! レッツ スペル!", "Hi! Let’s spell!"],
  setTitle: ["Pick your words", "ワード セット", "Pick your words"],
  styleTitle: ["Pick your style", "スタイル", "Pick your style"],
  start: ["Start!", "スタート!", "Start"],
  map: ["My heat map", "ヒートマップ", "My heat map"],
  progress: ["Word {n} of {total}", "ワード {n}/{total}"],
  bubble: ["Listen carefully, then tap the letters!", "チャレンジ!", "Listen, then spell it!"],
  check: ["Check!", "チェック!", "Check my spelling"],
  retryTitle: ["So close!", "ドンマイ!", "So close!"],
  retrySub: ["Nearly there — have another go.", "ファイト!", "No worries! You’re nearly there."],
  yours: ["You wrote", "ユア スペル", "You wrote"],
  hint: ["Hint", "ヒント", "Hint"],
  retry: ["Try again", "リトライ", "Try again"],
  show: ["Show me", "アンサー", "Show me"],
  revealTitle: ["Here it is!", "アンサー!", "Here it is!"],
  revealSub: ["Tricky one! Mochi will save it for practice.", "ネクスト ファイト!", "We’ll practise it again soon."],
  next: ["Next word", "ネクスト!", "Next word"],
  nextLast: ["See my results", "リザルト!", "See my results"],
  successTitle: ["Perfect!", "パーフェクト!", "Perfect!"],
  secondTry: ["You got it!", "ナイス!", "You got it!"],
  sticker: ["New sticker!", "ステッカー ゲット!", "New sticker!"],
  noSticker: ["{n} stickers", "ステッカー {n}", "{n} stickers"],
  combo: ["{n} in a row!", "{n} コンボ!", "{n} in a row!"],
  comboStart: ["Keep going!", "ファイト!", "Keep going!"],
  power: ["Power up", "パワー アップ", "Power up"],
  doneTitle: ["All done!", "クリア!", "All done!"],
  doneSub: ["{n} of {total} right first time", "{n}/{total} パーフェクト", "{n} of {total} right first time"],
  again: ["Play again", "ワンモア!", "Play again"],
  mapTitle: ["My heat map", "ヒートマップ", "My spelling heat map"],
  all: ["All my words", "オール ワード", "All my words"],
  low: ["Got it", "オッケー", "Got it"],
  high: ["Tricky", "ピンチ", "Tricky"],
  weak: ["My weak spots", "ピンチ ワード", "My weak spots"],
  weakGloss: ["Tricky letters", "ピンチ ワード", "Tricky letters"],
  noWeak: ["No weak spots yet — play a round and Mochi will keep track!", "ノー ピンチ!", "No weak spots yet — play a round!"],
  patterns: ["Tricky patterns", "パターン", "Tricky patterns"],
  goes: ["Last 5 goes →", "ラスト 5 →", "Last 5 goes →"],
  train: ["Practise these", "トレーニング!", "Practise my tricky words"],
  rank: ["Rank {r}", "ランク {r}"],
  missedOf: ["{m} of {n} goes tricky", "{m}/{n} ピンチ", "{m} of {n} goes tricky"],
};

const kakkoii: Record<Exclude<Key, keyof typeof shared>, Line> = {
  title: ["MANGA SPELLING", "マンガ スペル", "Manga Spelling"],
  hello: ["Ready for battle, hero? Every word you beat powers you up.", "スタンバイ OK? ヒーロー!", "Ready for battle, hero?"],
  setTitle: ["Choose your mission", "ミッション", "Choose your words"],
  styleTitle: ["Choose your style", "スタイル", "Choose your style"],
  start: ["Battle!", "バトル スタート!", "Start the battle"],
  map: ["Power map", "パワー マップ", "Power map"],
  progress: ["Round {n} / {total}", "ラウンド {n}/{total}"],
  bubble: ["Listen up. Spell it right to land the hit!", "バトル! ラウンド {n}", "Round {n} — listen, then strike!"],
  check: ["Strike!", "アタック!", "Check my spelling"],
  retryTitle: ["Not yet!", "リベンジ!", "Rematch!"],
  retrySub: ["Every hero misses sometimes. Strike again!", "ドンマイ! ファイト!", "Every hero misses sometimes. Strike again!"],
  yours: ["YOU WROTE", "ユア スペル", "YOU WROTE"],
  hint: ["Secret move", "ヒント", "Secret move"],
  retry: ["Strike again", "リベンジ", "Try again"],
  show: ["Reveal", "アンサー", "Reveal it"],
  revealTitle: ["Boss move revealed", "アンサー!", "Here’s the answer"],
  revealSub: ["Learn it. This one goes on your training list.", "トレーニング!", "It goes on your training list."],
  next: ["Next round", "ネクスト!", "Next round"],
  nextLast: ["Mission results", "リザルト!", "Mission results"],
  successTitle: ["CRITICAL HIT!", "クリティカル!", "Critical hit!"],
  secondTry: ["DIRECT HIT!", "ヒット!", "Direct hit!"],
  sticker: ["Power up", "パワー アップ", "Power up"],
  noSticker: ["Power up", "パワー アップ", "Power up"],
  combo: ["Combo", "コンボ", "{n} in a row"],
  comboStart: ["Combo", "コンボ", "Combo"],
  power: ["Power up", "パワー アップ", "Power"],
  doneTitle: ["MISSION CLEAR!", "ミッション クリア!", "Mission clear!"],
  doneSub: ["{n} of {total} critical hits", "{n}/{total} クリティカル", "{n} of {total} critical hits"],
  again: ["New mission", "ワンモア!", "New mission"],
  mapTitle: ["POWER MAP", "パワー マップ", "My spelling heat map"],
  all: ["All words", "オール ワード", "All words"],
  low: ["Mastered", "マスター", "Mastered"],
  high: ["Danger", "デンジャー", "Danger"],
  weak: ["Boss words", "ボス ワード", "Boss words"],
  weakGloss: ["Boss words", "ボス ワード", "Boss words"],
  noWeak: ["No bosses yet. Battle a round to find them.", "ノー ボス!", "No bosses yet. Battle a round!"],
  patterns: ["Weak points", "パターン", "Weak points"],
  goes: ["Last 5 battles →", "ラスト 5 →", "Last 5 battles →"],
  train: ["Training mode", "トレーニング!", "Train on my boss words"],
  rank: ["Rank {r}", "ランク {r}"],
  missedOf: ["{m} of {n} battles missed", "{m}/{n} ミス", "{m} of {n} battles missed"],
};

const TABLE: Record<Mode, Record<Key, Line>> = {
  kawaii: { ...shared, ...kawaii },
  kakkoii: { ...shared, ...kakkoii },
};

export const LEVELS: Record<Mode, { en: string[]; kana: string[] }> = {
  kawaii: {
    en: ["Got it every time", "Nearly always right", "Sometimes tricky", "Often tricky", "Needs practice"],
    kana: ["オッケー", "オッケー", "ファイト", "ピンチ", "ピンチ!"],
  },
  kakkoii: {
    en: ["Mastered", "Strong", "Wobbly", "Weak point", "Danger zone"],
    kana: ["マスター", "パワー", "ファイト", "ピンチ", "デンジャー"],
  },
};

export type Vars = Record<string, string | number>;

const fill = (s: string, vars?: Vars) =>
  vars ? s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? "")) : s;

export interface Text {
  main: string;
  /** English gloss, only in katakana mode */
  gloss: string | null;
  kana: boolean;
}

export const text = (s: Settings, key: Key, vars?: Vars): Text => {
  const [en, ja, gloss] = TABLE[s.mode][key];
  const kana = s.lang === "kana";
  return {
    main: fill(kana ? ja : en, vars),
    gloss: kana && (gloss ?? en) !== ja ? fill(gloss ?? en, vars) : null,
    kana,
  };
};

export type { Key as TextKey };
