import { $, component$, useOnDocument, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Dots, HomeLink, Lives, Tiles, type TileState } from "~/components/game-bits/game-bits";
import { Heart, Icon, Sparkle } from "~/components/icon/icon";
import { DELETE, ENTER, Keyboard } from "~/components/keyboard/keyboard";
import { Mochi } from "~/components/mochi/mochi";
import { Tx } from "~/components/tx/tx";
import { findForm, type SetId } from "~/data/words";
import { feedback } from "~/lib/diff";
import { celebrate, vibrate } from "~/lib/fx";
import { playSfx } from "~/lib/sfx";
import { buildHint } from "~/lib/hints";
import { pickRound, rankFor, recordGo, recordMiss } from "~/lib/progress";
import { loadSettings, useSettings } from "~/lib/settings";
import { speak } from "~/lib/speak";

const ROUND_SIZE = 10;
const MAX_TRIES = 3;
const POWER_BY_TRY = [0, 50, 30, 20];
const MAX_LENGTH = 20;

type Phase = "loading" | "listen" | "retry" | "reveal" | "success" | "done";

interface Item {
  /** Entry id used for progress */
  id: string;
  /** The form being tested */
  word: string;
  tries: number;
  ok: boolean | null;
}

interface Game {
  set: SetId;
  items: Item[];
  index: number;
  phase: Phase;
  input: string;
  lastAttempt: string;
  hot: number[];
  hint: string;
  combo: number;
  gained: number;
  sticker: boolean;
  stickers: number;
  power: number;
}

const sayWord = (word: string) => speak(word);

export default component$(() => {
  const settings = useSettings();
  const game = useStore<Game>({
    set: "y34",
    items: [],
    index: 0,
    phase: "loading",
    input: "",
    lastAttempt: "",
    hot: [],
    hint: "",
    combo: 0,
    gained: 0,
    sticker: false,
    stickers: 0,
    power: 0,
  });

  const startRound = $((set: SetId, focusWeak: boolean) => {
    const entries = pickRound(set, ROUND_SIZE, focusWeak);
    game.set = set;
    game.items = entries.map((e) => ({
      id: e.id,
      word: e.forms[Math.floor(Math.random() * e.forms.length)].word,
      tries: 0,
      ok: null,
    }));
    game.index = 0;
    game.input = "";
    game.combo = 0;
    game.phase = "listen";
    void sayWord(game.items[0].word);
  });

  // The round depends on localStorage progress, so it's picked in the browser
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("set");
    // Read storage directly: the layout may not have loaded settings yet
    const set: SetId = param === "y34" || param === "y56" ? param : loadSettings().set;
    settings.set = set;
    void startRound(set, params.get("focus") === "weak");
  });

  /** `quiet` skips the sound when the miss sound has just played */
  const reveal = $((quiet?: boolean) => {
    if (quiet !== true) playSfx("reveal", settings.mode);
    const item = game.items[game.index];
    item.ok = false;
    recordGo(item.id, { t: Date.now(), n: item.tries, ok: false }, 0, false);
    game.combo = 0;
    game.phase = "reveal";
  });

  const check = $(() => {
    if (game.phase !== "listen" || !game.input) return;
    const item = game.items[game.index];
    const form = findForm(item.word)!;
    item.tries++;
    if (game.input === item.word.toLowerCase()) {
      game.combo++;
      const power = POWER_BY_TRY[item.tries] + 10 * (Math.min(game.combo, 5) - 1);
      const sticker = item.tries === 1;
      const p = recordGo(item.id, { t: Date.now(), n: item.tries, ok: true }, power, sticker);
      item.ok = true;
      game.gained = power;
      game.sticker = sticker;
      game.stickers = p.stickers;
      game.power = p.power;
      game.phase = "success";
      playSfx("correct", settings.mode);
      vibrate(40);
      void celebrate(settings.mode);
      return;
    }
    const fb = feedback(game.input, item.word);
    recordMiss(item.id, item.word, fb.missed);
    game.lastAttempt = game.input;
    game.hot = fb.hot;
    game.hint = buildHint(form, fb.first, game.input, settings.mode);
    playSfx("incorrect", settings.mode);
    vibrate(120);
    if (item.tries >= MAX_TRIES) return reveal(true);
    game.phase = "retry";
  });

  const retry = $(() => {
    game.input = "";
    game.phase = "listen";
  });

  const next = $(() => {
    if (game.index + 1 >= game.items.length) {
      game.phase = "done";
      playSfx("done", settings.mode);
      void celebrate(settings.mode);
      return;
    }
    game.index++;
    game.input = "";
    game.lastAttempt = "";
    game.phase = "listen";
    void sayWord(game.items[game.index].word);
  });

  const onKey = $((key: string) => {
    if (game.phase !== "listen") return;
    if (key !== ENTER) playSfx("key", settings.mode);
    if (key === DELETE) game.input = game.input.slice(0, -1);
    else if (key === ENTER) void check();
    else if (game.input.length < MAX_LENGTH) game.input += key;
  });

  // Physical keyboard support for every phase
  useOnDocument(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (event.key === "Enter") {
        // A focused button or link handles Enter itself
        if (event.repeat || tag === "BUTTON" || tag === "A") return;
        if (game.phase === "listen") void check();
        else if (game.phase === "retry") void retry();
        else if (game.phase === "success" || game.phase === "reveal") void next();
      } else if (game.phase === "listen") {
        if (event.key === "Backspace") {
          void onKey(DELETE);
        } else if (/^[a-z]$/i.test(event.key)) {
          void onKey(event.key.toLowerCase());
        }
      }
    }),
  );

  const kawaii = settings.mode === "kawaii";
  const item = game.items[game.index] as Item | undefined;
  const form = item ? findForm(item.word) : undefined;
  const total = game.items.length || ROUND_SIZE;
  const progressVars = { n: game.index + 1, total };
  const livesLeft = item ? MAX_TRIES - item.tries : MAX_TRIES;
  const isLast = game.index + 1 >= game.items.length;

  if (game.phase === "loading" || !item || !form) {
    return (
      <main class="screen screen--listen">
        <div class="screen__inner screen__inner--center">
          <p class="loading" aria-live="polite">
            …
          </p>
        </div>
      </main>
    );
  }

  const topbar = (
    <div class="topbar topbar--game">
      <HomeLink />
      <div class="topbar__progress">
        <Tx k="progress" vars={progressVars} class="progress-label" />
        {game.phase === "listen" && <Dots total={total} index={game.index} />}
      </div>
      {(game.phase === "listen" || game.phase === "retry") && <Lives left={livesLeft} max={MAX_TRIES} />}
    </div>
  );

  if (game.phase === "listen") {
    const len = game.input.length;
    return (
      <main class="screen screen--listen">
        <div class="screen__inner">
          {topbar}
          {kawaii ? (
            <div class="mascot-row mascot-row--small">
              <Mochi mood="listen" size={64} />
              <p class="bubble bubble--high">
                <Tx k="bubble" vars={progressVars} />
              </p>
            </div>
          ) : (
            <p class="panel-box panel-box--slim">
              <Tx k="bubble" vars={progressVars} />
            </p>
          )}

          <div class="listen-controls">
            <div class="listen-controls__main">
              <button type="button" class="play-btn" aria-label="Hear the word" onClick$={() => sayWord(item.word)}>
                {!kawaii && (
                  <svg class="play-btn__burst" viewBox="0 0 100 100" aria-hidden="true">
                    <polygon class="play-btn__shadow" transform="translate(4 4)" points={BURST} />
                    <polygon class="play-btn__face" points={BURST} />
                  </svg>
                )}
                <Icon name="speaker" size={kawaii ? 52 : 50} class="play-btn__icon" />
              </button>
              <Tx k="play" class="play-label" />
            </div>
            <div class="listen-controls__side">
              <button type="button" class="btn-soft" onClick$={() => speak(item.word, 0.5)}>
                <Icon name={kawaii ? "snail" : "timer"} class="btn-soft__icon" />
                <Tx k="slow" />
              </button>
              <button type="button" class="btn-soft" onClick$={() => speak(`${item.word}. ${form.sentence}`)}>
                <Icon name="sentence" class="btn-soft__icon" />
                <Tx k="sentence" />
              </button>
            </div>
          </div>

          <div class="answer">
            <span id="answer-label" class="answer__label">
              <Tx k="type" inline />
            </span>
            <div
              class={["answer__box", len > 12 ? "is-tiny" : len > 9 ? "is-small" : ""]}
              role="textbox"
              aria-readonly="true"
              aria-labelledby="answer-label"
              aria-live="polite"
            >
              <span class="answer__text">{game.input}</span>
              <span class="answer__caret" aria-hidden="true" />
              {len === 0 && (
                <span class="answer__placeholder">
                  <Tx k="placeholder" />
                </span>
              )}
            </div>
          </div>

          <div class="keyboard-dock">
            <Keyboard onKey$={onKey}>
              <button type="button" class="btn-main btn-main--check" disabled={len === 0} onClick$={check}>
                <span class="btn-main__inner">
                  <Tx k="check" class="btn-main__label" />
                </span>
              </button>
            </Keyboard>
          </div>
        </div>
      </main>
    );
  }

  if (game.phase === "retry" || game.phase === "reveal") {
    const revealing = game.phase === "reveal";
    const attemptTiles = game.lastAttempt.split("").map((ch, i) => ({
      ch,
      state: (game.hot.includes(i) ? "hot" : "plain") as TileState,
    }));
    return (
      <main class="screen screen--retry">
        <div class="screen__inner">
          {topbar}
          <div class="retry-hero">
            {kawaii ? (
              <>
                <span class="sfx sfx--asease" lang="ja" aria-hidden="true">
                  アセアセ
                </span>
                <Mochi mood="oops" size={revealing ? 104 : 132} />
                <h1 class="title-pop title-pop--retry">
                  <Tx k={revealing ? "revealTitle" : "retryTitle"} />
                </h1>
              </>
            ) : (
              <>
                <span class="sfx sfx--gaan" lang="ja" aria-hidden="true">
                  ガーン
                </span>
                <h1 class="title-slab">
                  <Tx k={revealing ? "revealTitle" : "retryTitle"} />
                </h1>
              </>
            )}
            <p class="retry-hero__sub">
              <Tx k={revealing ? "revealSub" : "retrySub"} />
            </p>
          </div>

          {game.lastAttempt && (
            <section class="word-card" aria-labelledby="yours-label">
              <span id="yours-label" class="word-card__label">
                <Tx k="yours" />
              </span>
              <Tiles letters={attemptTiles} label={`You wrote ${game.lastAttempt}`} />
            </section>
          )}

          {revealing ? (
            <section class="word-card word-card--answer" aria-label="The answer">
              <Tiles
                letters={item.word.split("").map((ch) => ({ ch, state: "reveal" as TileState }))}
                label={`The answer is ${item.word}`}
              />
              <span class="syllables">{form.syllables.join(" · ")}</span>
            </section>
          ) : (
            <section class="hint-card" aria-labelledby="hint-title">
              <Icon name={kawaii ? "bulb" : "bolt"} size={28} class="hint-card__icon" />
              <div class="hint-card__body">
                <h2 id="hint-title" class="hint-card__title">
                  <Tx k="hint" />
                </h2>
                <p class="hint-card__text">{game.hint}</p>
              </div>
            </section>
          )}

          {revealing && form.tip && (
            <section class="hint-card" aria-labelledby="hint-title">
              <Icon name={kawaii ? "bulb" : "bolt"} size={28} class="hint-card__icon" />
              <div class="hint-card__body">
                <h2 id="hint-title" class="hint-card__title">
                  <Tx k="hint" />
                </h2>
                <p class="hint-card__text">{form.tip}</p>
              </div>
            </section>
          )}

          <div class="actions">
            {revealing ? (
              <button type="button" class="btn-main" onClick$={next}>
                <span class="btn-main__inner">
                  <Tx k={isLast ? "nextLast" : "next"} class="btn-main__label" />
                  <Icon name="arrow" size={24} />
                </span>
              </button>
            ) : (
              <>
                <button type="button" class="btn-main" onClick$={retry}>
                  <span class="btn-main__inner">
                    <Icon name="retry" size={26} />
                    <Tx k="retry" class="btn-main__label btn-main__label--start" />
                  </span>
                </button>
                <div class="actions__pair">
                  <button type="button" class="btn-soft" onClick$={() => sayWord(item.word)}>
                    <Icon name="speakerSmall" class="btn-soft__icon" />
                    <Tx k="hearAgain" />
                  </button>
                  <button type="button" class="btn-soft" onClick$={() => reveal()}>
                    <Icon name="eye" class="btn-soft__icon" />
                    <Tx k="show" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (game.phase === "success") {
    const firstTry = item.tries === 1;
    const rank = rankFor(game.power);
    return (
      <main class="screen screen--success">
        <div class="screen__inner">
          {topbar}
          {kawaii ? (
            <div class="success-hero">
              <span class="sfx sfx--kira" lang="ja" aria-hidden="true">
                キラキラ
              </span>
              <span class="sfx sfx--pika" lang="ja" aria-hidden="true">
                ピカッ
              </span>
              <Sparkle size={30} fill="#FFE27A" class="success-hero__spark1" />
              <Sparkle size={20} fill="#C9B8FF" class="success-hero__spark2" />
              <Mochi mood="joy" size={150} class="success-hero__mochi" />
              <h1 class="title-pop title-pop--success">
                <Tx k={firstTry ? "successTitle" : "secondTry"} />
              </h1>
            </div>
          ) : (
            <div class="success-hero success-hero--hit">
              <span class="sfx sfx--doon" lang="ja" aria-hidden="true">
                ドーン!
              </span>
              <h1 class="title-slab title-slab--success">
                <Tx k={firstTry ? "successTitle" : "secondTry"} />
              </h1>
            </div>
          )}

          <section class="word-card word-card--ok" aria-label="The word">
            <Tiles letters={item.word.split("").map((ch) => ({ ch, state: "ok" as TileState }))} label={item.word} />
            <span class="syllables">{form.syllables.join(" · ")}</span>
          </section>

          {kawaii ? (
            <div class="reward-grid">
              <div class="reward reward--pink">
                <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true" class={["reward__star", !game.sticker && "is-dim"]}>
                  <path d={STAR} fill="#FFE27A" stroke="#FFFFFF" stroke-width="6" stroke-linejoin="round" />
                  <path d={STAR} fill="#FFE27A" stroke="#4A2340" stroke-width="2.2" stroke-linejoin="round" />
                  <circle cx="19.5" cy="24" r="1.8" fill="#4A2340" />
                  <circle cx="28.5" cy="24" r="1.8" fill="#4A2340" />
                  <path d="M21.5 28Q24 30.5 26.5 28" fill="none" stroke="#4A2340" stroke-width="1.8" stroke-linecap="round" />
                </svg>
                <Tx k={game.sticker ? "sticker" : "noSticker"} vars={{ n: game.stickers }} class="reward__label" />
              </div>
              <div class="reward reward--lilac">
                <div class="reward__hearts" aria-hidden="true">
                  {Array.from({ length: Math.max(1, Math.min(game.combo, 5)) }, (_, i) => (
                    <Heart key={i} filled />
                  ))}
                </div>
                <Tx k={game.combo >= 2 ? "combo" : "comboStart"} vars={{ n: game.combo }} class="reward__label" />
              </div>
            </div>
          ) : (
            <>
              <div class="reward-grid">
                <div class="stat">
                  <span class="stat__value">+{game.gained}</span>
                  <Tx k="power" class="stat__label" />
                </div>
                <div class="stat">
                  <span class="stat__value">×{game.combo}</span>
                  <Tx k="combo" vars={{ n: game.combo }} class="stat__label" />
                </div>
              </div>
              <RankBar rank={rank} />
            </>
          )}

          <div class="actions">
            <button type="button" class="btn-main" onClick$={next}>
              <span class="btn-main__inner">
                <Tx k={isLast ? "nextLast" : "next"} class="btn-main__label" />
                <Icon name="arrow" size={24} />
              </span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Round complete
  const firstTries = game.items.filter((i) => i.ok && i.tries === 1).length;
  return (
    <main class="screen screen--success">
      <div class="screen__inner">
        <div class="topbar topbar--game">
          <HomeLink />
        </div>
        {kawaii ? (
          <div class="success-hero">
            <Sparkle size={30} fill="#FFE27A" class="success-hero__spark1" />
            <Sparkle size={20} fill="#C9B8FF" class="success-hero__spark2" />
            <Mochi mood="joy" size={130} class="success-hero__mochi" />
            <h1 class="title-pop title-pop--success">
              <Tx k="doneTitle" />
            </h1>
          </div>
        ) : (
          <div class="success-hero success-hero--hit">
            <span class="sfx sfx--doon" lang="ja" aria-hidden="true">
              ドーン!
            </span>
            <h1 class="title-slab title-slab--success">
              <Tx k="doneTitle" />
            </h1>
          </div>
        )}
        <p class="done-sub">
          <Tx k="doneSub" vars={{ n: firstTries, total }} />
        </p>
        <ul class="results">
          {game.items.map((i) => (
            <li key={i.id} class={["result", i.ok ? (i.tries === 1 ? "is-perfect" : "is-ok") : "is-miss"]}>
              <Icon name={i.ok ? "check" : "cross"} size={16} />
              <span class="result__word">{i.word}</span>
            </li>
          ))}
        </ul>
        {!kawaii && <RankBar rank={rankFor(game.power)} />}
        <div class="actions">
          <button type="button" class="btn-main" onClick$={() => startRound(game.set, false)}>
            <span class="btn-main__inner">
              <Icon name="retry" size={24} />
              <Tx k="again" class="btn-main__label btn-main__label--start" />
            </span>
          </button>
          <Link href="/map/" class="btn-ghost">
            <Tx k="map" inline />
          </Link>
        </div>
      </div>
    </main>
  );
});

const RankBar = component$<{ rank: ReturnType<typeof rankFor> }>((props) => (
  <div class="rank-bar">
    <div class="rank-bar__labels">
      <Tx k="rank" vars={{ r: props.rank.name }} />
      {props.rank.next && <Tx k="rank" vars={{ r: props.rank.next }} class="rank-bar__next" />}
    </div>
    <div
      class="rank-bar__track"
      role="progressbar"
      aria-label="Progress to next rank"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={props.rank.pct}
    >
      <div class="rank-bar__fill" style={{ width: `${props.rank.pct}%` }} />
    </div>
  </div>
));

const BURST =
  "100,50 88.6,60.4 93.3,75 78.3,78.3 75,93.3 60.4,88.6 50,100 39.6,88.6 25,93.3 21.7,78.3 6.7,75 11.4,60.4 0,50 11.4,39.6 6.7,25 21.7,21.7 25,6.7 39.6,11.4 50,0 60.4,11.4 75,6.7 78.3,21.7 93.3,25 88.6,39.6";

const STAR = "M24 3L30 16.5L44.5 18L33.5 28L36.8 42.5L24 35L11.2 42.5L14.5 28L3.5 18L18 16.5Z";

export const head: DocumentHead = {
  title: "Spell it! · Manga Spelling",
};
