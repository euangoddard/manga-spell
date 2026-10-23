import { createContextId, useContext } from "@builder.io/qwik";
import type { SetId } from "~/data/words";

export type Mode = "kawaii" | "kakkoii";
export type Lang = "en" | "kana";

export interface Settings {
  mode: Mode;
  lang: Lang;
  set: SetId;
}

export const SETTINGS_KEY = "manga-spell:settings";

export const DEFAULT_SETTINGS: Settings = { mode: "kawaii", lang: "en", set: "y34" };

export const SettingsContext = createContextId<Settings>("manga-spell.settings");

export const useSettings = () => useContext(SettingsContext);

export const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (s: Settings) => {
  try {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ mode: s.mode, lang: s.lang, set: s.set }),
    );
  } catch {
    // Private mode or storage full: settings just won't persist
  }
};

/** Browser-tab icon per theme; the installed PWA keeps the single Mochi icon */
export const FAVICON: Record<Mode, string> = {
  kawaii: "/favicon.svg",
  kakkoii: "/favicon-kakkoii.svg",
};

/**
 * Runs before first paint so the stored theme and favicon are applied without
 * a flash. Must come after the favicon <link>. Kept in sync with SETTINGS_KEY.
 */
export const THEME_BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("${SETTINGS_KEY}")||"{}");if(s.mode){document.documentElement.dataset.mode=s.mode;var l=document.querySelector('link[rel="icon"]');if(l&&s.mode==="kakkoii")l.href="${FAVICON.kakkoii}"}}catch(e){}`;
