// src/shared/ui/HeroBackdrop.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

/** The graph-paper cell. Large enough to read as texture, not as a table. */
const GRID_CELL = 88;

/**
 * Where the rule dissolves. Matched to the veil, so the ground resolves once —
 * and it starts giving way earlier than the colour does, because a rule that
 * is still legible where the wash has gone reads as a table, not as texture.
 */
const MASK =
  "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 46%," +
  " rgba(0,0,0,0.18) 74%, rgba(0,0,0,0) 92%)";

export const styles = {
  /**
   * The graph paper, on its own layer so it can be faded on its own.
   *
   * It cannot live in the section's own `background` list: a mask applies to
   * the whole element, so fading the rule there would fade the wash and the
   * content with it and let the page's grey show through.
   */
  grid: { position: "absolute", inset: 0, pointerEvents: "none" },
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
      background: [
        /**
         * A veil that thickens downwards.
         *
         * The wash was made to fill a 120px band at the top of a card, where
         * it is a stripe of colour. Stretched over a whole page it stops being
         * texture and starts being the subject, and the content has to fight
         * it to be read. It gives way from about halfway and is spent near
         * the bottom, so the card on these pages still sits on colour —
         * white resolving directly under a white card left the card with
         * nothing to stand against.
         */
        "linear-gradient(180deg, rgba(255,255,255,0.42) 0%," +
          " rgba(255,255,255,0.80) 58%, rgba(255,255,255,0.99) 86%," +
          " rgba(255,255,255,1) 100%)",
        brand.cover,
      ].join(", "),
      // Kept in the object so the token is read; the section owns no border.
      color: token.colorText,
    },
    /**
     * The rule, fading out with the colour it sits on.
     *
     * Graph paper that runs to a hard edge at the bottom of the window looks
     * like the page was cropped. Dissolving it on the same stretch the wash
     * dies out lets the whole ground resolve to plain white together.
     */
    gridRule: {
      background: [
        `repeating-linear-gradient(to right, ${brand.gridLine} 0 1px, transparent 1px ${GRID_CELL}px)`,
        `repeating-linear-gradient(to bottom, ${brand.gridLine} 0 1px, transparent 1px ${GRID_CELL}px)`,
      ].join(", "),
      maskImage: MASK,
      WebkitMaskImage: MASK,
    },
  }) satisfies Record<string, CSSProperties>;
