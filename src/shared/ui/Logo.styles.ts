// src/shared/ui/Logo.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * `isolate` IS LOAD-BEARING, and its absence is invisible until dark mode.
   *
   * The letters darken where they overlap by multiplying, and multiply blends
   * with whatever is BEHIND the element — not just with each other. Left
   * un-isolated, the whole mark multiplies with the page: harmless on white,
   * and on a dark surface it takes the logo down to almost nothing.
   *
   * Isolating gives the svg its own stacking context, so the backdrop the
   * letters blend against starts transparent and belongs to the mark alone.
   * Blending onto a transparent backdrop returns the source colour, so the
   * first letter paints flat and only the intersections darken — which is
   * exactly the artwork.
   */
  mark: { isolation: "isolate", display: "block" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** One colour for all three; the intersections make their own. */
    letter: { fill: token.colorPrimary, mixBlendMode: "multiply" },
  }) satisfies Record<string, CSSProperties>;
