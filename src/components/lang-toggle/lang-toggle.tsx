import { component$ } from "@builder.io/qwik";
import { useSettings } from "~/lib/settings";

/** English / katakana switch */
export const LangToggle = component$(() => {
  const settings = useSettings();
  return (
    <div class="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        aria-pressed={settings.lang === "en"}
        onClick$={() => (settings.lang = "en")}
      >
        English
      </button>
      <button
        type="button"
        lang="ja"
        aria-pressed={settings.lang === "kana"}
        onClick$={() => (settings.lang = "kana")}
      >
        カタカナ
      </button>
    </div>
  );
});
