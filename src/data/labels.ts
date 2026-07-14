export interface Label {
  name: string;
  src: string;
  invert?: boolean;
}

/** Prefer web-sourced SVG marks where publicly available; keep raster fallbacks otherwise. */
export const labels: Label[] = [
  { name: "Monstercat", src: "/labels/monstercat.svg", invert: true },
  { name: "NoCopyrightSounds", src: "/labels/ncs.svg" },
  { name: "Ophelia Records", src: "/labels/ophelia.png" },
  { name: "Insomniac Records", src: "/labels/insomniac-music-group.svg" },
  { name: "Uncaged", src: "/labels/uncaged.png" },
  { name: "CHOMPO", src: "/labels/chompo.png" },
  { name: "Ninety9Lives", src: "/labels/ninety9lives.png" },
];
