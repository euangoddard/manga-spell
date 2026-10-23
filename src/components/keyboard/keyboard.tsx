import { component$, Slot, type QRL } from "@builder.io/qwik";
import { vibrate } from "~/lib/fx";
import { Icon } from "../icon/icon";

export const DELETE = "⌫";
export const ENTER = "↵";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

interface KeyboardProps {
  /** Called with a lowercase letter, DELETE or ENTER */
  onKey$: QRL<(key: string) => void>;
}

/** On-screen letter keyboard; the page handles a physical keyboard */
export const Keyboard = component$<KeyboardProps>(({ onKey$ }) => {
  return (
    <div class="keyboard" role="group" aria-label="Letter keyboard">
      {ROWS.map((row, i) => (
        <div class="keyboard__row" key={row}>
          {row.split("").map((ch) => (
            <button
              type="button"
              class="key"
              key={ch}
              aria-label={ch}
              preventdefault:mousedown
              onClick$={() => {
                vibrate(8);
                onKey$(ch);
              }}
            >
              {ch}
            </button>
          ))}
          {i === ROWS.length - 1 && (
            <button
              type="button"
              class="key key--del"
              aria-label="Delete letter"
              preventdefault:mousedown
              onClick$={() => {
                vibrate(8);
                onKey$(DELETE);
              }}
            >
              <Icon name="del" size={26} />
            </button>
          )}
        </div>
      ))}
      <Slot />
    </div>
  );
});
