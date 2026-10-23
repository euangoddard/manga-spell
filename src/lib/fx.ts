import type { Mode } from "./settings";

export const vibrate = (ms: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  navigator.vibrate?.(ms);
};

export const celebrate = async (mode: Mode) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  if (mode === "kawaii") {
    void confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.35 },
      colors: ["#C92A73", "#FF9EC4", "#C9B8FF", "#FFE27A", "#FFFFFF"],
      shapes: ["circle", "star"],
      scalar: 1.1,
    });
  } else {
    void confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 55,
      origin: { y: 0.4 },
      colors: ["#FFD400", "#D92B26", "#F4F1EA"],
      shapes: ["square"],
      scalar: 1.2,
    });
  }
};
