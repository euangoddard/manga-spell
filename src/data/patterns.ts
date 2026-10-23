export interface Pattern {
  id: string;
  name: string;
  test: (word: string) => boolean;
}

const among = (words: string) => {
  const list = new Set(words.split(" "));
  return (w: string) => list.has(w);
};

/** Spelling patterns used to group weak spots on the heat map */
export const PATTERNS: Pattern[] = [
  { id: "double", name: "Double letters", test: (w) => /(.)\1/i.test(w) },
  {
    id: "silent",
    name: "Silent letters",
    test: among(
      "answer build guard guide island knowledge often reign naughty straight caught thought rhyme rhythm yacht muscle conscience conscious foreign guarantee vehicle neighbour",
    ),
  },
  { id: "ie", name: "ie or ei", test: (w) => /ie|ei/i.test(w) },
  { id: "ough", name: "ough & augh", test: (w) => /ough|augh/i.test(w) },
  {
    id: "hidden",
    name: "Hidden letters",
    test: among(
      "February library different interest ordinary separate favourite history medicine probably definite desperate category cemetery secretary vegetable temperature environment government parliament average marvellous interfere",
    ),
  },
  { id: "tion", name: "tion & sion", test: (w) => /tion|sion|cian/i.test(w) },
  { id: "ous", name: "ous endings", test: (w) => /ous$/i.test(w) },
  { id: "ar", name: "ar & er endings", test: (w) => /(ar|ary|er)$/i.test(w) },
];
