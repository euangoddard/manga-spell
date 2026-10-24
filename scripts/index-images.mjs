/*
 * Writes public/img/words/index.json, the file list the service worker
 * precaches, and checks that every word entry has a kawaii and a kakkoii
 * picture (and vice versa).
 *
 *   node scripts/index-images.mjs
 */
import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { pictureSrc } from "../src/lib/picture.ts";
import { WORD_SETS } from "../src/data/words.ts";

const DIR = fileURLToPath(new URL("../public/img/words/", import.meta.url));
const list = (dir) =>
  readdirSync(`${DIR}${dir}`)
    .filter((f) => f.endsWith(".svg"))
    .map((f) => `${dir}${f}`)
    .sort();
// Each entry has a kawaii picture and a kakkoii one (in kakkoii/)
const files = [...list(""), ...list("kakkoii/")];

const expected = new Set();
for (const entries of Object.values(WORD_SETS)) {
  for (const e of entries) {
    expected.add(pictureSrc(e.id).replace("/img/words/", ""));
    expected.add(pictureSrc(e.id, true).replace("/img/words/", ""));
  }
}
const missing = [...expected].filter((f) => !files.includes(f));
const extra = files.filter((f) => !expected.has(f));
if (missing.length) console.error(`Missing pictures: ${missing.join(" ")}`);
if (extra.length) console.error(`Unused pictures: ${extra.join(" ")}`);

writeFileSync(`${DIR}index.json`, JSON.stringify(files) + "\n");
console.log(`${files.length} pictures indexed for ${expected.size} entries`);
process.exitCode = missing.length || extra.length ? 1 : 0;
