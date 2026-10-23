import {
  component$,
  Slot,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import {
  DEFAULT_SETTINGS,
  FAVICON,
  loadSettings,
  saveSettings,
  SettingsContext,
  type Settings,
} from "~/lib/settings";

const THEME_COLOR = { kawaii: "#C92A73", kakkoii: "#111014" };

export default component$(() => {
  const settings = useStore<Settings>({ ...DEFAULT_SETTINGS });
  useContextProvider(SettingsContext, settings);

  const loaded = useSignal(false);

  // Settings live in localStorage, so they can only be read in the browser
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    () => {
      Object.assign(settings, loadSettings());
      loaded.value = true;
    },
    { strategy: "document-ready" },
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ track }) => {
      track(() => [settings.mode, settings.lang, settings.set]);
      if (!track(loaded)) return;
      saveSettings(settings);
      const html = document.documentElement;
      html.dataset.mode = settings.mode;
      html.dataset.lang = settings.lang;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", THEME_COLOR[settings.mode]);
      // Replace the element rather than editing href: Safari ignores edits
      const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (icon && !icon.href.endsWith(FAVICON[settings.mode])) {
        const fresh = icon.cloneNode() as HTMLLinkElement;
        fresh.href = FAVICON[settings.mode];
        icon.replaceWith(fresh);
      }
    },
    { strategy: "document-ready" },
  );

  return <Slot />;
});
