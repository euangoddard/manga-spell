import { component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { Icon, Sparkle } from "~/components/icon/icon";
import { LangToggle } from "~/components/lang-toggle/lang-toggle";
import { Mochi } from "~/components/mochi/mochi";
import { Tx } from "~/components/tx/tx";
import { WORD_SETS, type SetId } from "~/data/words";
import { entryLevel, loadProgress, rankFor } from "~/lib/progress";
import { useSettings, type Mode } from "~/lib/settings";

const SETS: { id: SetId; label: string }[] = [
  { id: "y34", label: "Years 3 & 4" },
  { id: "y56", label: "Years 5 & 6" },
];

const STYLES: { id: Mode; kana: string; label: string }[] = [
  { id: "kawaii", kana: "カワイイ", label: "Kawaii · cute" },
  { id: "kakkoii", kana: "カッコイイ", label: "Kakkoii · cool" },
];

export default component$(() => {
  const settings = useSettings();
  const stats = useStore({
    rank: "C",
    learnt: { y34: 0, y56: 0 } as Record<SetId, number>,
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const p = loadProgress();
    stats.rank = rankFor(p.power).name;
    for (const set of SETS) {
      stats.learnt[set.id] = WORD_SETS[set.id].filter(
        (e) => entryLevel(p.entries[e.id]) === 0,
      ).length;
    }
  });

  const kawaii = settings.mode === "kawaii";
  const kana = settings.lang === "kana";

  return (
    <main class="screen screen--home">
      <div class="screen__inner">
        {!kawaii && (
          <span class="sfx sfx--gogogo" lang="ja" aria-hidden="true">
            ゴゴゴ
          </span>
        )}
        <div class="topbar">
          {kawaii ? (
            <div class="sparkles" aria-hidden="true">
              <Sparkle size={22} fill="#FFE27A" />
              <Sparkle size={14} fill="#C9B8FF" />
            </div>
          ) : (
            <div class="rank-badge">
              <Icon name="bolt" size={16} />
              <Tx k="rank" vars={{ r: stats.rank }} />
            </div>
          )}
          <LangToggle />
        </div>

        <div class="home-title">
          {kawaii ? (
            <h1 class="title-pop" lang={kana ? "ja" : undefined}>
              {kana ? "マンガ スペル" : "Manga Spelling"}
            </h1>
          ) : (
            <h1 class="title-hit" lang={kana ? "ja" : undefined}>
              <span class="title-hit__top">{kana ? "マンガ" : "MANGA"}</span>
              <span class="title-hit__bar">{kana ? "スペル" : "SPELLING"}</span>
            </h1>
          )}
          {kana && <span class="gloss">Manga Spelling</span>}
        </div>

        {kawaii ? (
          <div class="mascot-row">
            <Mochi mood="happy" size={104} />
            <p class="bubble bubble--low">
              <Tx k="hello" />
            </p>
          </div>
        ) : (
          <p class="panel-box">
            <Tx k="hello" />
          </p>
        )}

        <section class="picker" aria-labelledby="set-title">
          <h2 id="set-title" class="section-title">
            <Tx k="setTitle" inline />
          </h2>
          <div class="picker__grid">
            {SETS.map((set) => (
              <button
                key={set.id}
                type="button"
                class="choice"
                aria-pressed={settings.set === set.id}
                onClick$={() => (settings.set = set.id)}
              >
                <span class="choice__title">{set.label}</span>
                <span class="choice__sub">
                  <Tx k="count" />
                  {stats.learnt[set.id] > 0 && (
                    <>
                      {" · "}
                      <Tx k="learnt" vars={{ n: stats.learnt[set.id] }} />
                    </>
                  )}
                </span>
                <span class="choice__tick" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section class="picker" aria-labelledby="style-title">
          <h2 id="style-title" class="section-title">
            <Tx k="styleTitle" inline />
          </h2>
          <div class="picker__grid">
            {STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                class={["style-card", `style-card--${style.id}`]}
                aria-pressed={settings.mode === style.id}
                onClick$={() => (settings.mode = style.id)}
              >
                <span class="style-card__kana" lang="ja">
                  {style.kana}
                </span>
                <span class="style-card__label">{style.label}</span>
                <span class="choice__tick" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <div class="actions">
          <Link href="/play/" class="btn-main btn-main--big">
            <span class="btn-main__inner">
              <Tx k="start" class="btn-main__label" />
            </span>
          </Link>
          <Link href="/map/" class="btn-ghost">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              class="map-glyph"
            >
              <rect x="3" y="3" width="8" height="8" class="lv-1" />
              <rect x="13" y="3" width="8" height="8" class="lv-4" />
              <rect x="3" y="13" width="8" height="8" class="lv-3" />
              <rect x="13" y="13" width="8" height="8" class="lv-0" />
            </svg>
            <Tx k="map" inline />
          </Link>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Manga Spelling · Year 3–6 statutory spelling words",
  meta: [
    {
      name: "description",
      content:
        "Practise the Year 3–6 statutory spelling words with a free, playful spelling test. Kawaii or Kakkoii manga style, works offline, and your progress stays on your device.",
    },
  ],
};
