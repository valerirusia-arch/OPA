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
/**
 * Three times the blur, not two: the wash now drifts further (a slow, visible
 * flow the designer asked for), so the solid ground under it has to extend
 * further past the viewport or a translate could pull the layer's own edge in.
 */
const WASH_BLEED = WASH_BLUR * 3;

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
     * THE SECOND LAYER, over the first and travelling against it.
     *
     * One sheet sliding under a page is a sheet sliding. Two layers at
     * different speeds in opposite directions is light moving, and it costs
     * one more div: the blobs pass each other, so the colour on any part of
     * the page keeps changing without any of it going anywhere.
     *
     * Longer and looser than the first — 96 seconds — because it carries only
     * two blobs and has room to travel without meeting an edge.
     */
    drift: {
      inset: -WASH_BLEED,
      filter: `blur(${WASH_BLUR}px)`,
      background: brand.coverDrift,
      animation: "opa-drift-b 96s ease-in-out infinite",
      willChange: "transform",
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
      /*
        A SLOW, VISIBLE DRIFT — *"მინდა რომ ეს მოძრაობდეს... ოღონდ ძალიან ნელა
        მშვიდად... სანდოობა, არ ვჩქარობთ."* The bloom should be seen to flow,
        the way the reference does, but at a pace that reads as unhurried. So
        the travel is generous (see the keyframes) and the clock is long — 64
        seconds here, 96 on the second layer: large movement over a long time
        is slow movement you can still watch.

        The layer is grown by three times the blur radius, so a translate of
        this size cannot pull a hard edge into view. `@keyframes` has no
        CSSProperties form, so the animation lives in index.html beside the
        sparkle's, and the same file switches it off under
        `prefers-reduced-motion`.
      */
      animation: "opa-drift 64s ease-in-out infinite",
      willChange: "transform",
      // No white veil over it: the reference wash carries its pastel colour
      // edge to edge, and a card on it stays legible on its own shadow.
      background: brand.cover,
    },
  }) satisfies Record<string, CSSProperties>;
