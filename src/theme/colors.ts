import type { palette } from "./palette";

/** Every token name, with plain strings: the light and dark values differ. */
export type Colors = Record<keyof (typeof palette)["light"], string>;
