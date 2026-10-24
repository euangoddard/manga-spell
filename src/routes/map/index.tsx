import {
  component$,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { HomeLink } from "~/components/game-bits/game-bits";
import { Icon } from "~/components/icon/icon";
import { Tx } from "~/components/tx/tx";
import { WORD_SETS, type SetId } from "~/data/words";
import {
  entryLevel,
  letterHeat,
  loadProgress,
  missedCount,
  patternSummaries,
  type Progress,
} from "~/lib/progress";
import { useSettings } from "~/lib/settings";
import { sayAll } from "~/lib/speak";
import { LEVELS } from "~/lib/strings";

const TABS: { id: SetId; label: string }[] = [
  { id: "y34", label: "Years 3 & 4" },
  { id: "y56", label: "Years 5 & 6" },
];

export default component$(() => {
  const settings = useSettings();
  const tab = useSignal<SetId>(settings.set);
  const selected = useSignal<string | null>(null);
  const data = useStore<{ progress: Progress; ready: boolean }>({
    progress: { entries: {}, power: 0, stickers: 0 },
    ready: false,
  });

  // Follow the home screen's choice once stored settings have loaded
  useTask$(({ track }) => {
    tab.value = track(() => settings.set);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    data.progress = loadProgress();
    data.ready = true;
  });

  const kawaii = settings.mode === "kawaii";
  const kana = settings.lang === "kana";
  const levelNames = LEVELS[settings.mode];
  const entries = WORD_SETS[tab.value];
  const p = data.progress;

  const levels = entries.map((e) => entryLevel(p.entries[e.id]));
  // Start on the weakest word so the detail panel is useful straight away
  let selIndex = entries.findIndex((e) => e.id === selected.value);
  if (selIndex < 0) {
    const worst = Math.max(...levels);
    selIndex = Math.max(0, levels.indexOf(worst));
  }
  const sel = entries[selIndex];
  const selLevel = levels[selIndex];
  const selStats = p.entries[sel.id];
  const selNote =
    selLevel < 0
      ? kana
        ? "ネクスト チャレンジ · Not tried yet"
        : "Not tried yet"
      : `${kana ? `${levelNames.kana[selLevel]} · ` : ""}${levelNames.en[selLevel]} · ${missedCount(selStats)} of ${selStats?.goes.length ?? 0} ${kawaii ? "goes tricky" : "battles missed"}`;

  const weak = entries
    .map((e, i) => ({ e, lv: levels[i], missed: missedCount(p.entries[e.id]) }))
    .filter((x) => x.lv >= 1)
    .sort((a, b) => b.lv - a.lv || b.missed - a.missed)
    .slice(0, 3);
  const patterns = patternSummaries(tab.value, p);
  const tried = levels.filter((l) => l >= 0).length;
  const mastered = levels.filter((l) => l === 0).length;

  return (
    <main class="screen screen--map">
      <div class="screen__inner screen__inner--wide">
        <div class="topbar topbar--map">
          <HomeLink back />
          <div class="map-title">
            <h1
              class={
                kawaii
                  ? "title-pop title-pop--small"
                  : "title-slab title-slab--small"
              }
            >
              <Tx k="mapTitle" />
            </h1>
          </div>
        </div>

        <div class="tabs" role="group" aria-label="Word set">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab.value === t.id}
              onClick$={() => {
                tab.value = t.id;
                selected.value = null;
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div class="map-layout">
          <section class="map-card" aria-labelledby="grid-title">
            <div class="map-card__head">
              <h2 id="grid-title" class="map-card__title">
                <Tx k="all" />
              </h2>
              <span class="map-card__meta">
                {tried}/100 · {mastered} <Tx k="low" />
              </span>
            </div>
            <div class="heat-grid">
              {entries.map((e, i) => {
                const lv = levels[i];
                return (
                  <button
                    key={e.id}
                    type="button"
                    class={["heat-cell", lv < 0 ? "lv-none" : `lv-${lv}`]}
                    title={e.label}
                    aria-label={`${e.label}, ${lv < 0 ? "not tried yet" : levelNames.en[lv]}`}
                    aria-pressed={i === selIndex}
                    onClick$={() => (selected.value = e.id)}
                  />
                );
              })}
            </div>
            <div class="legend">
              <Tx k="low" />
              <div class="legend__scale" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} class={["legend__swatch", `lv-${l}`]} />
                ))}
              </div>
              <Tx k="high" class="legend__high" />
              <span
                class="legend__swatch legend__swatch--none lv-none"
                aria-hidden="true"
              />
              <Tx k="untried" class="legend__untried" />
            </div>
            <div class="selected" aria-live="polite">
              <span
                class={[
                  "selected__swatch",
                  selLevel < 0 ? "lv-none" : `lv-${selLevel}`,
                ]}
                aria-hidden="true"
              />
              <div class="selected__body">
                <span class="selected__word">{sel.label}</span>
                <span class="selected__note">{data.ready ? selNote : "…"}</span>
              </div>
              <button
                type="button"
                class="round-btn round-btn--small"
                aria-label={`Hear ${sel.label}`}
                onClick$={() => sayAll(sel.forms)}
              >
                <Icon name="speakerSmall" size={20} />
              </button>
            </div>
          </section>

          <div class="map-side">
            <section class="weak" aria-labelledby="weak-title">
              <h2 id="weak-title" class="section-title">
                <Tx k="weak" inline />
              </h2>
              {weak.length === 0 ? (
                <p class="weak-card weak-card--empty">
                  <Tx k="noWeak" />
                </p>
              ) : (
                weak.map(({ e }) => {
                  const heat = letterHeat(e, p.entries[e.id]);
                  const form =
                    e.forms.find(
                      (f) => f.word === heat.map((h) => h.ch).join(""),
                    ) ?? e.forms[0];
                  return (
                    <div key={e.id} class="weak-card">
                      <div
                        class="weak-card__letters"
                        role="img"
                        aria-label={`${form.word}: tricky letters highlighted`}
                      >
                        {heat.map((h, i) => (
                          <span
                            key={i}
                            class={["weak-letter", `lv-${h.level}`]}
                            aria-hidden="true"
                          >
                            {h.ch}
                          </span>
                        ))}
                      </div>
                      <span class="weak-card__tip">
                        {form.tip ??
                          `Say it slowly: ${form.syllables.join("‑")}.`}
                      </span>
                    </div>
                  );
                })
              )}
            </section>

            <section class="map-card" aria-labelledby="pat-title">
              <div class="map-card__head">
                <h2 id="pat-title" class="map-card__title">
                  <Tx k="patterns" />
                </h2>
                <span class="map-card__meta">
                  <Tx k="goes" />
                </span>
              </div>
              {patterns.map((pt) => (
                <div key={pt.name} class="pattern">
                  <div class="pattern__text">
                    <span class="pattern__name">{pt.name}</span>
                    <span class="pattern__eg">{pt.examples.join(", ")}</span>
                  </div>
                  <div
                    class="pattern__cells"
                    role="img"
                    aria-label={`${pt.name}: ${pt.cells.map((c) => (c === null ? "not yet" : levelNames.en[c])).join(", ")}`}
                  >
                    {pt.cells.map((c, i) => (
                      <span
                        key={i}
                        class={[
                          "pattern__cell",
                          c === null ? "lv-none" : `lv-${c}`,
                        ]}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <Link
              href={`/play/?set=${tab.value}${weak.length ? "&focus=weak" : ""}`}
              class="btn-main"
            >
              <span class="btn-main__inner">
                <Tx k="train" class="btn-main__label" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Heat map · Manga Spelling",
  meta: [
    {
      name: "description",
      content:
        "Your personal spelling heat map. See which Year 3–6 statutory words you know and which need more practice.",
    },
    { name: "robots", content: "noindex" },
  ],
};
