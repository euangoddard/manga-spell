import { component$ } from "@builder.io/qwik";
import { useSettings } from "~/lib/settings";
import { text, type TextKey, type Vars } from "~/lib/strings";

interface TxProps {
  k: TextKey;
  vars?: Vars;
  class?: string;
  /** Put the English gloss beside the text rather than under it */
  inline?: boolean;
}

/** Text in the current language; katakana mode adds a small English gloss */
export const Tx = component$<TxProps>((props) => {
  const settings = useSettings();
  const t = text(settings, props.k, props.vars);
  return (
    <span class={["tx", props.inline && "tx--inline", props.class]}>
      <span class="tx__main" lang={t.kana ? "ja" : undefined}>
        {t.main}
      </span>
      {t.gloss && (
        <span class="tx__gloss" lang="en">
          {t.gloss}
        </span>
      )}
    </span>
  );
});
