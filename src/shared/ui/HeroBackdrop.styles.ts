// src/shared/ui/HeroBackdrop.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

/**
 * HOW FAR THE WASH IS BLURRED, and how far it is grown to allow for it.
 *
 * A blur samples outwards, so a layer blurred inside its own box fades to
 * transparent at all four edges and the page's grey shows in a band around
 * the wash. The layer is grown by more than the blur radius so the soft edge
 * falls outside the section entirely.
 */
const WASH_BLUR = 72;
const WASH_BLEED = WASH_BLUR * 2;

export const styles = {
  /**
   * THE WASH, ON ITS OWN LAYER — because it is blurred.
   *
   * It used to be the section's own `background`, which cannot be blurred
   * without blurring the content standing on it. On its own layer it takes a
   * filter of its own and everything above it stays sharp.
   *
   * The graph paper that used to sit here is gone: a ruled ground under a
   * single card read as a form the card had been dropped onto — *"უკან ეს
   * გრიდები მოაშორე."*
   */
  wash: { position: "absolute", pointerEvents: "none" },
  content: { position: "relative", width: "100%" },
  /** Lets the page's own ground show through. */
  plain: { background: "none" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The backdrop is the whole page, not a band at the top of one.
     *
     * A page with one card on it does not fill a window, and a coloured strip
     * that stops two thirds of the way down draws a line across nothing — the
     * eye reads it as a section boundary and looks for the next section.
     * Running the ground to the bottom of the viewport removes the question.
     */
    hero: {
      position: "relative",
      // minHeight is set by the component, from its own measured top offset.
      boxSizing: "border-box",
      display: "flex",
      overflow: "hidden",
      background: token.colorBgContainer,
      color: token.colorText,
    },
    /**
     * The colour, softened twice over.
     *
     * LIGHTER, because the washes were mixed for a 120px band at the top of a
     * card and over a whole page the same strengths read as weather —
     * *"ძაან მუქია უკან, ოდნავ უფრო ნათელი."* Their alphas come down in
     * `brand.cover`.
     *
     * AND BLURRED, so what is left has no edge anywhere. A radial gradient is
     * already soft, but four of them overlapping make seams where they meet;
     * the blur dissolves those and leaves colour with no shape to it.
     *
     * The veil over the top still thickens downwards, so the page resolves to
     * white before the bottom of the window and a white card near the foot
     * still has something to stand against.
     */
    wash: {
      inset: -WASH_BLEED,
      filter: `blur(${WASH_BLUR}px)`,
      background: [
        "linear-gradient(180deg, rgba(255,255,255,0.30) 0%," +
          " rgba(255,255,255,0.74) 58%, rgba(255,255,255,0.98) 86%," +
          " rgba(255,255,255,1) 100%)",
        brand.cover,
      ].join(", "),
    },
  }) satisfies Record<string, CSSProperties>;
