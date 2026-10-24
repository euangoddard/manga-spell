/*
 * Generates the spoken audio in public/audio with Amazon Polly (neural, en-GB
 * "Arthur", eu-west-1). Uses the AWS CLI and whatever credentials it resolves
 * (AWS_PROFILE etc.). Existing files are skipped, so re-running only fills
 * gaps; pass --force to regenerate everything.
 *
 *   node scripts/generate-audio.mjs [--force]
 *
 * Per word form this writes three clips (names from audioName in src/lib/audio.ts):
 *   <word>.mp3           the word at normal speed
 *   <word>-slow.mp3      the word slowly (the "slow" button)
 *   <word>-sentence.mp3  the word, a pause, then the example sentence
 * plus index.json, the file list the service worker precaches.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { audioName } from "../src/lib/audio.ts";
import { WORD_SETS } from "../src/data/words.ts";

const OUT = fileURLToPath(new URL("../public/audio/", import.meta.url));
const REGION = "eu-west-1";
const VOICE = "Arthur";
const SLOW_RATE = "55%";
const force = process.argv.includes("--force");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const forms = new Map();
for (const entries of Object.values(WORD_SETS)) {
  for (const e of entries) for (const f of e.forms) forms.set(f.word, f);
}

const clips = [];
for (const { word, sentence } of forms.values()) {
  clips.push([audioName(word), `<speak>${esc(word)}</speak>`]);
  clips.push([
    audioName(word, "slow"),
    `<speak><prosody rate="${SLOW_RATE}">${esc(word)}</prosody></speak>`,
  ]);
  clips.push([
    audioName(word, "sentence"),
    `<speak>${esc(word)}<break time="600ms"/>${esc(sentence)}</speak>`,
  ]);
}

mkdirSync(OUT, { recursive: true });
let made = 0;
for (const [name, ssml] of clips) {
  const file = `${OUT}${name}`;
  if (!force && existsSync(file)) continue;
  execFileSync(
    "aws",
    [
      "polly",
      "synthesize-speech",
      "--region",
      REGION,
      "--engine",
      "neural",
      "--voice-id",
      VOICE,
      "--language-code",
      "en-GB",
      "--output-format",
      "mp3",
      "--text-type",
      "ssml",
      "--text",
      ssml,
      file,
    ],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  made++;
  console.log(`${made} ${name}`);
}

writeFileSync(
  `${OUT}index.json`,
  JSON.stringify(clips.map(([name]) => name).sort()) + "\n",
);
console.log(`Generated ${made} new clips, ${clips.length} in total`);
