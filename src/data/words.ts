export type SetId = "y34" | "y56";

export interface Word {
  /** The correct spelling, e.g. "February" */
  word: string;
  /** Syllable chunks used for "say it slowly" hints */
  syllables: string[];
  /** A sentence read aloud for context */
  sentence: string;
  /** An optional memory trick */
  tip?: string;
}

/** [syllables separated by "|", sentence, tip?] */
type Raw = [string, string, string?];

const Y34: Raw[] = [
  ["ac|ci|dent", "I knocked over my drink by accident.", "Two c’s: ac‑ci‑dent."],
  ["ac|tu|al", "The actual size of a blue whale is enormous."],
  ["ad|dress", "Write your address on the envelope.", "Double d and double s: ad‑dress."],
  ["an|swer", "Put up your hand if you know the answer.", "There’s a silent w: an‑s‑w‑er."],
  ["ap|pear", "Stars appear in the sky at night.", "Double p, then ear: ap‑pear."],
  ["ar|rive", "The train will arrive at six o’clock.", "Double r: ar‑rive."],
  ["be|lieve", "I believe you can do it!", "Never believe a lie: i before e."],
  ["bi|cy|cle", "She rode her bicycle to the park.", "Bi means two: a bi‑cycle has two wheels."],
  ["breath", "Take a deep breath before you jump.", "Breath is the thing — no e on the end."],
  ["breathe", "Fish breathe through their gills.", "Breathe is the doing word — it ends in e."],
  ["build", "Let’s build a den in the garden.", "u and i build together: b‑ui‑ld."],
  ["bu|sy", "The shop was very busy on Saturday.", "The u says i: b‑u‑sy."],
  ["bus|i|ness", "My aunt runs a cake business.", "busy + ness: change y to i — bus‑i‑ness."],
  ["cal|en|dar", "Circle the date on the calendar.", "It ends in ar, not er."],
  ["caught", "The goalkeeper caught the ball.", "augh: c‑augh‑t, like taught."],
  ["cen|tre", "We met in the centre of town.", "It ends in re: cen‑tre."],
  ["cen|tu|ry", "A century is one hundred years.", "Cent means 100: cen‑tu‑ry."],
  ["cer|tain", "Are you certain you locked the door?", "It ends in tain, like captain."],
  ["cir|cle", "Draw a circle with your compass.", "Starts with cir, ends with cle."],
  ["com|plete", "Complete the puzzle before lunch."],
  ["con|sid|er", "Please consider my idea."],
  ["con|tin|ue", "We will continue the story tomorrow.", "It ends in ue: con‑tin‑ue."],
  ["de|cide", "I can’t decide which ice cream to choose.", "The c is soft: de‑cide."],
  ["de|scribe", "Describe the dragon in your story.", "de + scribe (which means to write)."],
  ["dif|fer|ent", "Every snowflake is different.", "differ + ent: don’t miss the middle e."],
  ["dif|fi|cult", "This puzzle is really difficult.", "Double f: dif‑fi‑cult."],
  ["dis|ap|pear", "The magician made the rabbit disappear.", "dis + appear: one s, two p’s."],
  ["ear|ly", "We got up early to watch the sunrise.", "It starts with ear: ear‑ly."],
  ["earth", "The Earth travels around the Sun.", "There’s an ear in earth."],
  ["eight", "A spider has eight legs.", "eigh says ay, like weigh."],
  ["eighth", "My birthday is on the eighth of May.", "eight + h."],
  ["e|nough", "Have you had enough to eat?", "ough says uff here: e‑n‑ough."],
  ["ex|er|cise", "Exercise keeps your heart healthy."],
  ["ex|pe|ri|ence", "Camping was an amazing experience.", "It ends in ence: ex‑pe‑ri‑ence."],
  ["ex|per|i|ment", "We did a science experiment with vinegar."],
  ["ex|treme", "Penguins live in extreme cold."],
  ["fa|mous", "She wants to be a famous footballer.", "It ends in ous: fa‑mous."],
  ["fa|vour|ite", "Blue is my favourite colour.", "favour + ite: don’t forget the u."],
  ["Feb|ru|ar|y", "Pancake Day is sometimes in February.", "Don’t forget the hidden r: Feb‑r‑uary."],
  ["for|ward", "Take one step forward."],
  ["for|wards", "The car rolled forwards down the hill.", "forward + s."],
  ["fruit", "An apple is a crunchy fruit.", "u and i: fr‑ui‑t."],
  ["gram|mar", "Check your grammar and punctuation.", "Double m, and it ends in ar."],
  ["group", "Work in a group of four.", "ou says oo: gr‑ou‑p."],
  ["guard", "A guard stood outside the castle.", "Silent u after the g: g‑u‑ard."],
  ["guide", "Our guide showed us the caves.", "Silent u after the g: g‑u‑ide."],
  ["heard", "I heard a strange noise.", "You hear with your ear: h‑ear‑d."],
  ["heart", "Your heart pumps blood around your body.", "There’s an ear in heart: h‑ear‑t."],
  ["height", "Measure your height against the wall.", "eigh, then t: h‑eigh‑t."],
  ["his|to|ry", "We are learning about Roman history."],
  ["i|ma|gine", "Imagine you could fly!", "It ends in ine: i‑ma‑gine."],
  ["in|crease", "The price will increase next year."],
  ["im|por|tant", "It is important to drink water."],
  ["in|ter|est", "Dinosaurs are my biggest interest.", "inter + est: don’t miss the middle e."],
  ["is|land", "We sailed to a tiny island.", "An island is land in the sea — with a silent s."],
  ["know|ledge", "Her knowledge of planets is amazing.", "know + ledge."],
  ["learn", "We learn something new every day.", "There’s an ear in learn."],
  ["length", "Measure the length of the table.", "long → length: the g comes before th."],
  ["li|brar|y", "I borrowed three books from the library.", "Two r’s: li‑br‑ar‑y."],
  ["ma|te|ri|al", "Wool is a soft material."],
  ["med|i|cine", "Take your medicine after breakfast.", "medi + cine: med‑i‑cine."],
  ["men|tion", "Did she mention the party?", "It ends in tion: men‑tion."],
  ["min|ute", "Wait a minute, please."],
  ["nat|u|ral", "Wood is a natural material.", "nature + al: drop the e."],
  ["naugh|ty", "The naughty puppy chewed my shoe.", "augh: n‑augh‑ty, like caught."],
  ["no|tice", "Did you notice the rainbow?", "It ends in ice: no‑tice."],
  ["oc|ca|sion", "A wedding is a special occasion.", "Two c’s, one s: oc‑ca‑sion."],
  ["oc|ca|sion|al|ly", "We occasionally have pizza on Fridays.", "Two c’s, one s and two l’s."],
  ["of|ten", "We often walk to school.", "There’s a silent t: of‑t‑en."],
  ["op|po|site", "Hot is the opposite of cold.", "Double p: op‑po‑site."],
  ["or|di|nar|y", "It was just an ordinary day.", "Say it slowly: or‑di‑nar‑y."],
  ["par|tic|u|lar", "Is there a particular book you want?", "It ends in lar: par‑tic‑u‑lar."],
  ["pe|cu|li|ar", "The soup had a peculiar smell.", "It ends in iar: pe‑cu‑li‑ar."],
  ["per|haps", "Perhaps it will snow tomorrow.", "per + haps."],
  ["pop|u|lar", "Football is a popular sport.", "It ends in lar: pop‑u‑lar."],
  ["po|si|tion", "Get into position for the race.", "It ends in tion: po‑si‑tion."],
  ["pos|sess", "Dragons possess magical powers.", "Possess has four s’s!"],
  ["pos|ses|sion", "My bike is my favourite possession.", "possess + ion."],
  ["pos|si|ble", "Anything is possible!", "Double s, and it ends in ible."],
  ["po|ta|toes", "We had roast potatoes for dinner.", "One potato, two potatoes: add es."],
  ["pres|sure", "Check the pressure in your tyres.", "press + ure."],
  ["prob|ab|ly", "It will probably rain later.", "probable → probably."],
  ["prom|ise", "I promise to tidy my room."],
  ["pur|pose", "What is the purpose of this button?", "pur + pose."],
  ["quar|ter", "A quarter of an hour is fifteen minutes.", "q is always followed by u."],
  ["ques|tion", "Can I ask a question?", "q is always followed by u."],
  ["re|cent", "This is a recent photo of my dog.", "The c is soft: re‑cent."],
  ["reg|u|lar", "Regular exercise keeps you fit.", "It ends in lar: reg‑u‑lar."],
  ["reign", "The queen’s reign lasted seventy years.", "There’s a silent g: r‑ei‑g‑n."],
  ["re|mem|ber", "Remember to bring your coat."],
  ["sen|tence", "Start every sentence with a capital letter.", "sent + ence: e, e, e."],
  ["sep|a|rate", "Keep the eggs separate from the flour.", "There’s a rat in sep‑a‑rat‑e!"],
  ["spe|cial", "Today is a special day.", "cial says shul: spe‑cial."],
  ["straight", "Draw a straight line with a ruler.", "str + aight: like eight with an a."],
  ["strange", "A strange light glowed in the sky."],
  ["strength", "It takes strength to lift a heavy box.", "strong → strength: the g comes before th."],
  ["sup|pose", "I suppose we could go to the park.", "Double p: sup‑pose."],
  ["sur|prise", "We threw a surprise party for Mum.", "Two r’s: su‑r‑p‑r‑ise."],
  ["there|fore", "It is raining, therefore we will stay in.", "there + fore."],
  ["though", "It was sunny, though it was cold.", "ough says oh here: th‑ough."],
  ["al|though", "Although it rained, we had fun.", "al + though: just one l."],
  ["thought", "I thought about it all night.", "ough + t: th‑ough‑t."],
  ["through", "The train went through the tunnel.", "ough says oo here: thr‑ough."],
  ["var|i|ous", "We tried various flavours of crisps.", "It ends in ous: var‑i‑ous."],
  ["weight", "Check the weight of the parcel.", "eigh says ay: w‑eigh‑t."],
  ["wo|man", "The woman walked her dog.", "One woman, like one man."],
  ["wo|men", "Three women ran the marathon.", "Lots of women, like lots of men."],
];

const Y56: Raw[] = [
  ["ac|com|mo|date", "The hotel can accommodate fifty guests.", "Two c’s and two m’s: ac‑com‑mo‑date."],
  ["ac|com|pa|ny", "Will you accompany me to the shop?", "Two c’s, but one m."],
  ["ac|cord|ing", "According to the map, we’re nearly there.", "Double c: ac‑cord‑ing."],
  ["a|chieve", "You can achieve anything with practice.", "i before e: a‑ch‑ie‑ve."],
  ["ag|gres|sive", "The aggressive goose chased us away.", "Double g and double s."],
  ["am|a|teur", "He is an amateur golfer.", "It ends in eur: am‑a‑teur."],
  ["an|cient", "We visited an ancient castle.", "cient says shunt: an‑cient."],
  ["ap|par|ent", "It was apparent that she was tired.", "Double p, one r: ap‑par‑ent."],
  ["ap|pre|ci|ate", "I appreciate your help.", "Double p: ap‑pre‑ci‑ate."],
  ["at|tached", "A note was attached to the present.", "Double t: at‑tached."],
  ["a|vail|a|ble", "Is this seat available?", "avail + able."],
  ["av|er|age", "The average age in our class is ten.", "Say it slowly: av‑er‑age."],
  ["awk|ward", "There was an awkward silence.", "Two w’s: a‑w‑k‑w‑ard."],
  ["bar|gain", "These trainers were a bargain!", "bar + gain."],
  ["bruise", "I got a bruise when I fell off my scooter.", "u then i: br‑ui‑se."],
  ["cat|e|go|ry", "Which category does a whale belong to?", "There’s a cat in cat‑e‑go‑ry."],
  ["cem|e|ter|y", "The old cemetery is next to the church.", "Three e’s, like a scream: c‑e‑m‑e‑t‑e‑ry."],
  ["com|mit|tee", "The school committee planned the fair.", "Double m, double t, double e."],
  ["com|mu|ni|cate", "Dolphins communicate with clicks.", "Double m: com‑mu‑ni‑cate."],
  ["com|mu|ni|ty", "Our community planted new trees.", "Double m: com‑mu‑ni‑ty."],
  ["com|pe|ti|tion", "She won the drawing competition.", "compete → com‑pe‑ti‑tion."],
  ["con|science", "My conscience told me to own up.", "con + science."],
  ["con|scious", "Be conscious of other people’s feelings.", "sc, then ious: con‑sc‑ious."],
  ["con|tro|ver|sy", "The new rule caused controversy."],
  ["con|ven|ience", "Use the bins at your convenience.", "It ends in ience: con‑ven‑ience."],
  ["cor|re|spond", "I correspond with a pen pal in France.", "Double r: cor‑re‑spond."],
  ["crit|i|cise", "Don’t criticise your friends’ drawings.", "critic + ise."],
  ["cu|ri|os|i|ty", "Curiosity makes us ask questions.", "curious → curiosity: the u drops out."],
  ["def|i|nite", "Is the trip definite or just a maybe?", "There’s finite in de‑finite."],
  ["des|per|ate", "The thirsty dog was desperate for water.", "Say it slowly: des‑per‑ate."],
  ["de|ter|mined", "She was determined to finish the race.", "de + term + ined."],
  ["de|vel|op", "Tadpoles develop into frogs.", "No e on the end: de‑vel‑op."],
  ["dic|tion|ar|y", "Look up the word in a dictionary.", "diction + ary."],
  ["dis|as|trous", "The storm was disastrous for the crops.", "disaster → disastrous: the e drops out."],
  ["em|bar|rass", "Please don’t embarrass me in front of my friends!", "Double r and double s — two pairs!"],
  ["en|vi|ron|ment", "We must protect the environment.", "There’s iron in env‑iron‑ment."],
  ["e|quip", "We need to equip the team with new kit.", "q is always followed by u."],
  ["e|quipped", "The kitchen is equipped with a huge oven.", "Double the p before ed."],
  ["e|quip|ment", "Put the PE equipment back in the cupboard.", "equip + ment: just one p."],
  ["es|pe|cial|ly", "I love fruit, especially strawberries.", "es + special + ly."],
  ["ex|ag|ger|ate", "Don’t exaggerate — it wasn’t that big!", "Double g: ex‑ag‑ger‑ate."],
  ["ex|cel|lent", "That was an excellent goal!", "Double l: ex‑cel‑lent."],
  ["ex|is|tence", "Do you believe in the existence of aliens?", "It ends in ence: ex‑is‑tence."],
  ["ex|pla|na|tion", "Write an explanation of how volcanoes work.", "explain → explanation: the i drops out."],
  ["fa|mil|iar", "That song sounds familiar.", "It ends in iar: fa‑mil‑iar."],
  ["for|eign", "Can you speak a foreign language?", "ei, then a silent g: for‑ei‑g‑n."],
  ["for|ty", "There are forty children in the choir.", "No u in forty — unlike four."],
  ["fre|quent|ly", "It frequently rains in Wales.", "frequent + ly."],
  ["gov|ern|ment", "The government makes the laws.", "govern + ment: don’t miss the n."],
  ["guar|an|tee", "I guarantee you’ll love this book.", "Silent u: g‑u‑ar‑an‑tee."],
  ["har|ass", "Don’t harass the cat!", "One r, two s’s."],
  ["hin|drance", "The heavy bag was a hindrance.", "hinder → hindrance: the e drops out."],
  ["i|den|ti|ty", "The spy kept her identity a secret."],
  ["im|me|di|ate", "The doctor gave immediate help.", "Double m: im‑me‑di‑ate."],
  ["im|me|di|ate|ly", "Come here immediately!", "immediate + ly."],
  ["in|di|vid|u|al", "Each individual gets a medal."],
  ["in|ter|fere", "Don’t interfere with the experiment.", "inter + fere."],
  ["in|ter|rupt", "Please don’t interrupt when I’m talking.", "Double r: inter‑rupt."],
  ["lan|guage", "French is a beautiful language.", "u after the g: lan‑gu‑age."],
  ["lei|sure", "Swimming is my favourite leisure activity.", "ei, not ie: l‑ei‑sure."],
  ["light|ning", "Lightning flashed across the sky.", "No e: light‑ning."],
  ["mar|vel|lous", "We had a marvellous time at the zoo.", "Double l: mar‑vel‑lous."],
  ["mis|chie|vous", "The mischievous monkey stole my hat.", "mischief → mischievous: no i after the v."],
  ["mus|cle", "Your heart is a muscle.", "Silent c: mus‑c‑le."],
  ["ne|ces|sar|y", "It is necessary to wear a helmet.", "One collar, two sleeves: 1 c, 2 s’s."],
  ["neigh|bour", "Our neighbour has a fluffy cat.", "neigh like a horse, then bour."],
  ["nui|sance", "The buzzing fly was a nuisance.", "u then i: n‑ui‑sance."],
  ["oc|cu|py", "Puzzles occupy me on long journeys.", "Double c: oc‑cu‑py."],
  ["oc|cur", "Earthquakes occur when the ground moves.", "Double c: oc‑cur."],
  ["op|por|tu|ni|ty", "This is a great opportunity to learn.", "Double p: op‑por‑tu‑ni‑ty."],
  ["par|lia|ment", "Parliament meets in London.", "I am in parl‑i‑a‑ment."],
  ["per|suade", "Can I persuade you to join the team?", "per + suade."],
  ["phys|i|cal", "Physical activity keeps you healthy.", "ph says f and y says i."],
  ["prej|u|dice", "We must stand up against prejudice."],
  ["priv|i|lege", "It was a privilege to meet the author.", "No d: priv‑i‑lege."],
  ["pro|fes|sion", "Teaching is a wonderful profession.", "One f, two s’s."],
  ["pro|gramme", "My favourite TV programme is on tonight.", "Double m, then e."],
  ["pro|nun|ci|a|tion", "Practise the pronunciation of new words.", "There’s a nun in pro‑nun‑ciation."],
  ["queue", "We had to queue for the roller coaster.", "q, then u‑e‑u‑e."],
  ["rec|og|nise", "I didn’t recognise you in that costume!"],
  ["rec|om|mend", "I recommend this book.", "One c, two m’s."],
  ["rel|e|vant", "Only include relevant facts.", "rel + e + vant."],
  ["res|tau|rant", "We had pizza at a restaurant.", "rest + au + rant."],
  ["rhyme", "Cat and hat rhyme.", "rh, then yme: the h is silent."],
  ["rhy|thm", "Clap to the rhythm of the music.", "Rhythm Has Your Two Hips Moving."],
  ["sac|ri|fice", "He made a sacrifice to help his friend."],
  ["sec|re|tar|y", "The secretary answered the phone.", "A secretary keeps a secret."],
  ["shoul|der", "The parrot sat on the pirate’s shoulder.", "ou: sh‑ou‑lder."],
  ["sig|na|ture", "Put your signature at the bottom.", "sign + ature."],
  ["sin|cere", "Please accept my sincere apology."],
  ["sin|cere|ly", "I sincerely hope you feel better.", "sincere + ly: keep the e."],
  ["sol|dier", "The soldier marched up the hill.", "di + er: sol‑di‑er."],
  ["stom|ach", "My stomach is rumbling.", "ch says k: stom‑ach."],
  ["suf|fi|cient", "We have sufficient food for the trip.", "Double f: suf‑fi‑cient."],
  ["sug|gest", "I suggest we take an umbrella.", "Double g: sug‑gest."],
  ["sym|bol", "The heart is a symbol of love.", "y says i: s‑y‑mbol."],
  ["sys|tem", "The solar system has eight planets.", "y says i: s‑y‑stem."],
  ["tem|per|a|ture", "Check the temperature before you swim.", "Say it slowly: tem‑per‑a‑ture."],
  ["thor|ough", "Give your hands a thorough wash.", "thor + ough."],
  ["twelfth", "Today is my twelfth birthday.", "twelve → twelfth: f, then th."],
  ["va|ri|e|ty", "The shop sells a variety of sweets."],
  ["veg|e|ta|ble", "A carrot is a vegetable.", "veg + e + table."],
  ["ve|hi|cle", "A bus is a large vehicle.", "Silent h: ve‑h‑icle."],
  ["yacht", "We sailed on a yacht.", "y‑a‑c‑h‑t: the ch is silent!"],
];

/**
 * The statutory lists group some words into families, e.g. "eight/eighth".
 * Each family is one of the 100 entries; a round tests any of its forms.
 */
const FAMILIES: Record<SetId, string[][]> = {
  y34: [
    ["busy", "business"],
    ["eight", "eighth"],
    ["forward", "forwards"],
    ["occasion", "occasionally"],
    ["possess", "possession"],
    ["though", "although"],
    ["woman", "women"],
  ],
  y56: [
    ["equip", "equipped", "equipment"],
    ["immediate", "immediately"],
    ["sincere", "sincerely"],
  ],
};

export interface Entry {
  /** Stable key used for progress, the first form's spelling */
  id: string;
  /** Shown on the heat map, e.g. "eight / eighth" */
  label: string;
  forms: Word[];
}

const build = (setId: SetId, raw: Raw[]): Entry[] => {
  const words = raw.map(([syl, sentence, tip]) => ({
    word: syl.replaceAll("|", ""),
    syllables: syl.split("|"),
    sentence,
    tip,
  }));
  const familyOf = new Map<string, string[]>();
  for (const family of FAMILIES[setId]) {
    for (const w of family) familyOf.set(w, family);
  }
  const entries: Entry[] = [];
  for (const w of words) {
    const family = familyOf.get(w.word);
    if (family && family[0] !== w.word) continue;
    const forms = family
      ? family.map((f) => words.find((x) => x.word === f)!)
      : [w];
    entries.push({
      id: w.word,
      label: forms.map((f) => f.word).join(" / "),
      forms,
    });
  }
  return entries;
};

export const WORD_SETS: Record<SetId, Entry[]> = {
  y34: build("y34", Y34),
  y56: build("y56", Y56),
};

export const findEntry = (setId: SetId, id: string): Entry | undefined =>
  WORD_SETS[setId].find((e) => e.id === id);

export const findForm = (word: string): Word | undefined => {
  for (const entries of Object.values(WORD_SETS)) {
    for (const e of entries) {
      const form = e.forms.find((f) => f.word === word);
      if (form) return form;
    }
  }
  return undefined;
};
