import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useSettings } from "~/lib/settings";
import { Heart, Icon } from "../icon/icon";

/** Hearts in Kawaii mode, energy bars in Kakkoii mode */
export const Lives = component$<{ left: number; max: number }>((props) => {
  const settings = useSettings();
  const label =
    settings.mode === "kawaii"
      ? `${props.left} ${props.left === 1 ? "heart" : "hearts"} left`
      : `Energy ${props.left} of ${props.max}`;
  return (
    <div class="lives" role="img" aria-label={label}>
      {settings.mode === "kakkoii" && <Icon name="bolt" size={16} class="lives__bolt" />}
      {Array.from({ length: props.max }, (_, i) =>
        settings.mode === "kawaii" ? (
          <Heart key={i} filled={i < props.left} />
        ) : (
          <span key={i} class={["lives__bar", i < props.left && "is-full"]} />
        ),
      )}
    </div>
  );
});

/** Round progress: one segment per word */
export const Dots = component$<{ total: number; index: number }>((props) => (
  <div class="dots" aria-hidden="true">
    {Array.from({ length: props.total }, (_, i) => (
      <span key={i} class={["dots__dot", i < props.index ? "is-done" : i === props.index ? "is-now" : ""]} />
    ))}
  </div>
));

export const HomeLink = component$<{ back?: boolean }>((props) => (
  <Link href="/" class="round-btn" aria-label={props.back ? "Back to home" : "Home"}>
    <Icon name={props.back ? "back" : "home"} />
  </Link>
));

export type TileState = "plain" | "hot" | "ok" | "reveal";

/** A row of letter tiles that shrink to fit long words */
export const Tiles = component$<{ letters: { ch: string; state: TileState }[]; label: string }>(
  (props) => (
    <div class="tiles" role="img" aria-label={props.label} style={{ "--n": props.letters.length }}>
      {props.letters.map((l, i) => (
        <span key={i} class={["tile", `tile--${l.state}`]} aria-hidden="true">
          {l.ch}
        </span>
      ))}
    </div>
  ),
);
