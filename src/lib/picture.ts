/** Path of an entry's illustration, e.g. "February" -> "/img/words/february.svg" (kakkoii: "/img/words/kakkoii/february.svg") */
export const pictureSrc = (id: string, kakkoii = false) =>
  `/img/words/${kakkoii ? "kakkoii/" : ""}${id.toLowerCase()}.svg`;
