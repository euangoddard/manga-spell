import { component$ } from "@builder.io/qwik";

const PATHS = {
  home: <path d="M3 11L12 4L21 11V20H15V14H9V20H3Z" />,
  back: <path d="M15 5L8 12L15 19" />,
  speaker: (
    <>
      <path d="M4 9H8L13 5V19L8 15H4Z" fill="currentColor" />
      <path d="M16 9C17.5 10.5 17.5 13.5 16 15" />
      <path d="M18.5 6.5C21.5 9.5 21.5 14.5 18.5 17.5" />
    </>
  ),
  speakerSmall: (
    <>
      <path d="M4 9H8L13 5V19L8 15H4Z" />
      <path d="M16 9C17.5 10.5 17.5 13.5 16 15" />
    </>
  ),
  snail: (
    <>
      <path d="M2.5 18H18.5C20.2 18 21.5 16.8 21.5 15" />
      <circle cx="11" cy="12" r="6" />
      <path d="M11 12.5A2 2 0 1 0 13 10.5" />
      <path d="M17 11L18.5 6" />
      <path d="M19.5 12L22 8" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13V8.5" />
      <path d="M10 2.5H14" />
    </>
  ),
  sentence: (
    <>
      <path d="M4 5H20V16H9L5 19.5V16H4Z" />
      <path d="M8 9H16" />
      <path d="M8 12H13" />
    </>
  ),
  del: (
    <>
      <path d="M8.5 5H20V19H8.5L2.5 12Z" />
      <path d="M11.5 9.5L16 14" />
      <path d="M16 9.5L11.5 14" />
    </>
  ),
  retry: (
    <>
      <path d="M4 12A8 8 0 1 0 6.8 6" />
      <path d="M4 3.5V8.5H9" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12C4.5 7 8 5 12 5C16 5 19.5 7 22 12C19.5 17 16 19 12 19C8 19 4.5 17 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </>
  ),
  check: <path d="M5 12.5L10 17.5L19 7" />,
  cross: (
    <>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </>
  ),
  bolt: <path d="M13 2L4 14H11L10 22L20 9H13Z" fill="currentColor" stroke="none" />,
  bulb: (
    <>
      <path d="M9 18H15" />
      <path d="M10 21H14" />
      <path d="M12 3C8.7 3 6 5.6 6 8.9C6 11.1 7.2 12.6 8.5 13.8C9.2 14.4 9.5 15.1 9.5 16H14.5C14.5 15.1 14.8 14.4 15.5 13.8C16.8 12.6 18 11.1 18 8.9C18 5.6 15.3 3 12 3Z" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  class?: string;
}

export const Icon = component$<IconProps>((props) => (
  <svg
    class={["icon", props.class]}
    width={props.size ?? 22}
    height={props.size ?? 22}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.4"
    aria-hidden="true"
  >
    {PATHS[props.name]}
  </svg>
));

/** The four-point sparkle used as decoration in Kawaii mode */
export const Sparkle = component$<{ size: number; fill: string; class?: string }>((props) => (
  <svg class={props.class} width={props.size} height={props.size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 1C12.8 8 16 11.2 23 12C16 12.8 12.8 16 12 23C11.2 16 8 12.8 1 12C8 11.2 11.2 8 12 1Z"
      fill={props.fill}
      stroke="#4A2340"
      stroke-width="1.8"
      stroke-linejoin="round"
    />
  </svg>
));

export const Heart = component$<{ filled: boolean; size?: number }>((props) => (
  <svg width={props.size ?? 22} height={props.size ?? 22} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 20C12 20 3 14.5 3 8.8C3 6.1 5.1 4 7.7 4C9.5 4 11.1 5 12 6.5C12.9 5 14.5 4 16.3 4C18.9 4 21 6.1 21 8.8C21 14.5 12 20 12 20Z"
      fill={props.filled ? "#FF6FA8" : "#FFFFFF"}
      stroke="#4A2340"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </svg>
));
