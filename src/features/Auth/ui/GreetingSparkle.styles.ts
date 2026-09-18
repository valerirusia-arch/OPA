// src/features/Auth/ui/GreetingSparkle.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /**
   * Sits on the greeting's own line, sized in `em` so it tracks the heading
   * rather than a fixed pixel. Nudged down a hair off the baseline so its
   * centre lands on the cap height of the word beside it.
   */
  root: {
    display: "inline-block",
    width: "0.92em",
    height: "0.82em",
    marginLeft: 10,
    verticalAlign: "-0.06em",
  },
  /**
   * The twinkle. The keyframes are declared once in index.html — @keyframes has
   * no CSSProperties form — and referenced by name. `transform-box: fill-box`
   * makes the scale pivot around each sparkle's own centre rather than the SVG
   * origin, so they pulse in place.
   */
  main: {
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: "opa-twinkle 2.6s ease-in-out infinite",
  },
  /** The smaller sparkle, offset in time so the pair breathes rather than
   *  blinks in unison. */
  small: {
    transformBox: "fill-box",
    transformOrigin: "center",
    animation: "opa-twinkle 2.6s ease-in-out 0.9s infinite",
  },
} satisfies Record<string, CSSProperties>;
