export type Clip = "slow" | "sentence";

/** File name of a pre-rendered clip in /audio, e.g. "february-slow.mp3" */
export const audioName = (word: string, clip?: Clip) =>
  `${word.toLowerCase()}${clip ? `-${clip}` : ""}.mp3`;
