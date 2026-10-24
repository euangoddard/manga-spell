import { component$, isDev } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { THEME_BOOT_SCRIPT } from "./lib/settings";
import { AUDIO_UNLOCK_SCRIPT } from "./lib/sfx";

import "./fonts.css";
import "./global.css";

/** Registers the offline service worker in production builds */
const SW_SCRIPT = `if("serviceWorker"in navigator)addEventListener("load",function(){navigator.serviceWorker.register("/sw.js")})`;

/** Dev only: drops a service worker left on this origin by an earlier production build, which would intercept dev requests */
const SW_CLEANUP_SCRIPT = `if("serviceWorker"in navigator)navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()});if(rs.length)caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k)})})})`;

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
        <script dangerouslySetInnerHTML={THEME_BOOT_SCRIPT} />
        <script dangerouslySetInnerHTML={AUDIO_UNLOCK_SCRIPT} />
        <script
          dangerouslySetInnerHTML={isDev ? SW_CLEANUP_SCRIPT : SW_SCRIPT}
        />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
