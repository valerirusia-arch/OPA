// src/shared/ui/scenes/AssetScene.styles.ts

import type { CSSProperties } from "react";

/** Every file is cropped to the same viewBox (171 × 119 — tight to the shadow),
 *  so the box takes the illustration's aspect and carries no empty space. */
export const getStyle = (
  url: string,
  width: number,
  vbHeight: number,
  center: boolean,
): CSSProperties => ({
  width,
  height: Math.round((width * vbHeight) / 171),
  ...(center ? { marginInline: "auto" } : {}),
  /* Quoted for the same reason GateScene.styles.ts is: an asset under Vite's
     4KB inline limit arrives as a data: URI carrying the SVG's own `url(…)`
     parentheses, which silently invalidates an unquoted declaration. Every
     file here is well over that today — this is so a smaller one later does
     not fail invisibly. */
  backgroundImage: `url("${url}")`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
});
