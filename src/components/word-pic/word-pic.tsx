import { component$ } from "@builder.io/qwik";
import { pictureSrc } from "~/lib/picture";
import { useSettings } from "~/lib/settings";

/** The word's picture (in the current style) in a manga panel. Decorative: it never carries the spelling. */
export const WordPic = component$<{ id: string }>((props) => {
  const settings = useSettings();
  return (
    <div class="word-pic">
      <img
        class="word-pic__img"
        src={pictureSrc(props.id, settings.mode === "kakkoii")}
        width={120}
        height={120}
        alt=""
        decoding="async"
      />
    </div>
  );
});
