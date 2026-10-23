# Manga Spelling ✨

A spelling test PWA for the English statutory word lists (Years 3 & 4 and Years 5 & 6, 100 entries each), built with Qwik City.

- **Two styles**: Kawaii (pastel, rounded, Mochi the bunny) and Kakkoii (ink black, speed lines, skewed yellow/red battle panels).
- **English or katakana** interface — katakana mode uses manga words (スタート!, ドンマイ!, クリティカル!) with a small English gloss.
- **Listen and spell**: words are read aloud with the browser's speech synthesis (British voice preferred), slowly, or in a sentence. On-screen keyboard plus physical keyboard support.
- **Try again / reveal / success** screens with hints generated from the child's mistake, three tries per word.
- **Heat map**: every word as a 10×10 grid, tricky letters within weak words, and weak spelling patterns over the last five goes.
- **Offline**: `public/sw.js` precaches every page and Qwik bundle listed in `q-manifest.json`.

Progress and settings are stored in `localStorage` only — nothing leaves the device.

Word data lives in `src/data/words.ts`; word families such as *eight / eighth* count as one entry, matching the statutory lists.

Run `npm run build` to produce the static site in `dist/`. It is deployed to <https://manga-spell.euans.space> by `.github/workflows/deploy.yml` on every push to `main`.

---

# Qwik City App ⚡️

- [Qwik Docs](https://qwik.dev/)
- [Discord](https://qwik.dev/chat)
- [Qwik GitHub](https://github.com/QwikDev/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.dev/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `npm run qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.dev/qwikcity/guides/static-site-generation/).

```shell
npm run qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

## Static Site Generator (Node.js)

Be sure to configure your server to serve very long cache headers for the `build/**/*.js` files.

Typically you'd set the `Cache-Control` header for those files to `public, max-age=31536000, immutable`.

```shell
npm run build.server
```
