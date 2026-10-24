import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

const SITE = "https://manga-spell.euans.space";
const DEFAULT_DESCRIPTION =
  "Practise the Year 3–6 statutory spelling words with a free, playful spelling test. Kawaii or Kakkoii manga style, works offline, and your progress stays on your device.";

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Manga Spelling",
  url: `${SITE}/`,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  inLanguage: "en-GB",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    audienceType: "Children aged 7–11 (Years 3–6)",
  },
});

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  const description =
    head.meta.find((m) => m.name === "description")?.content ??
    DEFAULT_DESCRIPTION;
  const url = `${SITE}${loc.url.pathname}`;
  const image = `${SITE}/og-image.png`;

  return (
    <>
      <title>{head.title}</title>

      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Manga Spelling" />
      <meta property="og:title" content={head.title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:image" content={image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Manga Spelling: a cute bunny beside the title, Year 3–6 statutory spelling words"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={head.title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <meta name="theme-color" content="#C92A73" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Manga Spell" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

      {loc.url.pathname === "/" && (
        <script type="application/ld+json" dangerouslySetInnerHTML={JSON_LD} />
      )}

      {head.meta
        .filter((m) => m.name !== "description")
        .map((m) => (
          <meta key={m.key} {...m} />
        ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
