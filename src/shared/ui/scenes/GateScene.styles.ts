// src/shared/ui/scenes/GateScene.styles.ts

import type { CSSProperties } from "react";

/** The gate exports are cropped to a 171 × 119 viewBox (tight to the shadow), so
 *  the box takes the illustration's aspect and carries no empty space. */
export const getGateStyle = (
  url: string,
  width: number,
  vbHeight: number,
): CSSProperties => ({
  width,
  height: Math.round((width * vbHeight) / 171),
  marginInline: "auto",
  /* THE QUOTES ARE LOAD-BEARING. Vite inlines any asset under 4KB as a
     `data:image/svg+xml,…` URI, and these exports are ~3.9KB — so the URL
     itself contains the SVG's own `url(%23clip…)` parentheses. Unquoted, that
     closes the CSS url() token early, the declaration is invalid and the
     browser drops it: a correctly sized box with no picture in it. */
  backgroundImage: `url("${url}")`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
});
