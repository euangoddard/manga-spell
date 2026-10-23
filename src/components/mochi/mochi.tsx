import { component$ } from "@builder.io/qwik";

export type Mood = "happy" | "listen" | "oops" | "joy";

const EARS: Record<Mood, [number, number]> = {
  happy: [-14, 14],
  listen: [-34, 14],
  oops: [-48, 48],
  joy: [-6, 6],
};

/** Mochi, the Kawaii mode bunny. Each mood matches a screen in the design. */
export const Mochi = component$<{ mood: Mood; size: number; class?: string }>((props) => {
  const [l, r] = EARS[props.mood];
  const lx = props.mood === "listen" ? 34 : props.mood === "oops" ? 32 : props.mood === "joy" ? 42 : 40;
  const rx = props.mood === "oops" ? 88 : props.mood === "joy" ? 78 : 80;
  const ey = props.mood === "oops" ? 42 : props.mood === "listen" ? 38 : props.mood === "joy" ? 30 : 34;
  const ry = props.mood === "oops" ? 42 : props.mood === "joy" ? 30 : 34;
  return (
    <svg class={["mochi", props.class]} width={props.size} height={props.size} viewBox="0 0 120 120" aria-hidden="true">
      <g stroke="#4A2340" stroke-width="3" stroke-linejoin="round">
        <ellipse cx={lx} cy={ey} rx="11" ry="24" fill="#FFFFFF" transform={`rotate(${l} ${lx} ${ey})`} />
        <ellipse cx={rx} cy={ry} rx="11" ry="24" fill="#FFFFFF" transform={`rotate(${r} ${rx} ${ry})`} />
      </g>
      <ellipse cx={lx} cy={ey + 2} rx="4.5" ry="14" fill="#FFB8D4" transform={`rotate(${l} ${lx} ${ey + 2})`} />
      <ellipse cx={rx} cy={ry + 2} rx="4.5" ry="14" fill="#FFB8D4" transform={`rotate(${r} ${rx} ${ry + 2})`} />
      <path
        d="M12 84C12 58 32 46 60 46C88 46 108 58 108 84C108 102 90 110 60 110C30 110 12 102 12 84Z"
        fill="#FFFFFF"
        stroke="#4A2340"
        stroke-width="3"
      />
      {props.mood === "oops" ? (
        <>
          <path d="M38 72L48 78L38 84" fill="none" stroke="#4A2340" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M82 72L72 78L82 84" fill="none" stroke="#4A2340" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M52 94Q56 90 60 94Q64 98 68 94" fill="none" stroke="#4A2340" stroke-width="2.5" stroke-linecap="round" />
          <path d="M104 50C104 50 97 59 97 63.5A7 7 0 0 0 111 63.5C111 59 104 50 104 50Z" fill="#9FD8FF" stroke="#4A2340" stroke-width="2" />
        </>
      ) : props.mood === "joy" ? (
        <>
          <path d="M37 80Q44 69 51 80" fill="none" stroke="#4A2340" stroke-width="3.4" stroke-linecap="round" />
          <path d="M69 80Q76 69 83 80" fill="none" stroke="#4A2340" stroke-width="3.4" stroke-linecap="round" />
          <path d="M50 88Q60 104 70 88Z" fill="#C92A73" stroke="#4A2340" stroke-width="2.5" stroke-linejoin="round" />
        </>
      ) : (
        <>
          <ellipse cx="44" cy="78" rx="6" ry="8" fill="#4A2340" />
          <ellipse cx="76" cy="78" rx="6" ry="8" fill="#4A2340" />
          <circle cx="46" cy="75" r="2.4" fill="#FFFFFF" />
          <circle cx="78" cy="75" r="2.4" fill="#FFFFFF" />
          {props.mood === "listen" ? (
            <ellipse cx="60" cy="93" rx="5" ry="4" fill="#4A2340" />
          ) : (
            <path d="M54 90Q57 95 60 90Q63 95 66 90" fill="none" stroke="#4A2340" stroke-width="2.5" stroke-linecap="round" />
          )}
        </>
      )}
      <ellipse cx={props.mood === "joy" ? 31 : 32} cy={props.mood === "joy" ? 90 : 92} rx="7" ry="4" fill="#FF9EC4" />
      <ellipse cx={props.mood === "joy" ? 89 : 88} cy={props.mood === "joy" ? 90 : 92} rx="7" ry="4" fill="#FF9EC4" />
    </svg>
  );
});
