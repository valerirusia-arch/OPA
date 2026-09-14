// src/features/LoanApplication/ui/RangeField.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * The type size steps DOWN as the number gets longer.
 *
 * A fixed size big enough for "$40,000" clips at "$1,250,000", and one small
 * enough for the long number wastes the effect on the short one. Stepping is
 * what a swap field does, and it is the reason a big amount input never
 * overflows: the field's width is the constant, the type gives way.
 */
const SIZES = [
  { upTo: 9, large: 34, compact: 24 },
  { upTo: 12, large: 28, compact: 21 },
  { upTo: Infinity, large: 23, compact: 18 },
];

/**
 * `compact` is for a field sharing its row with another.
 *
 * Two of these side by side are two headlines competing, and neither is the
 * page's subject the way a single annual income is. Sized to carry about the
 * weight of the ordinary fields around them, they read as fields with a slider
 * attached rather than as two placards dropped into the form; the number is
 * still the largest thing inside its own panel, which is all it needs to be.
 */
export const fontSizeFor = (rendered: string, compact = false) => {
  const step = SIZES.find((size) => rendered.length <= size.upTo)!;
  return compact ? step.compact : step.large;
};

export const styles = {
  /**
   * No focus ring of its own.
   *
   * antd draws one as an outline tight around the control, which inside a
   * recessed panel reads as a second, smaller field boxed within the first.
   * The ring moves to the panel below, where it outlines the thing the reader
   * actually thinks of as the field.
   */
  input: { width: "100%", paddingInline: 0, outline: "none" },
  /** antd gives the slider generous side margins; the panel already has them. */
  slider: { marginTop: 8, marginInline: 0, marginBottom: 2 },
  sliderCompact: { marginTop: 2, marginInline: 0, marginBottom: 4 },
  scale: { fontSize: 12, fontVariantNumeric: "tabular-nums" },
  scaleCompact: { fontSize: 11, fontVariantNumeric: "tabular-nums" },
  /** The quiet context line at the top of the box — see `caption` in the
   *  component. Sits on the input's own left edge (the input has no inline
   *  padding), so the reference value and the new one line up. */
  caption: { fontSize: 13, marginBottom: 4 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * Recessed, not outlined.
     *
     * The amount is the largest thing in the step, so it does not also need a
     * border to be found — a box that size reads as a panel rather than as a
     * field. The same recess the loan-details total sits in, so the number you
     * type and the number the form gives back look like the same kind of
     * thing.
     */
    surface: {
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
      transition: "box-shadow 120ms ease",
    },
    /**
     * Tighter all round, not just in the type.
     *
     * Shrinking the number inside a panel built for a 40px headline leaves the
     * figure floating in a box a third taller than it needs — the panel keeps
     * claiming the room the big type used to fill. The padding comes down with
     * it so the two fields read as fields, not as two placards.
     */
    surfaceCompact: { padding: token.paddingSM },
    /**
     * Focus lands on the panel, drawn INSIDE its own edge so nothing moves.
     *
     * A keyboard user still needs to see where they are — dropping the ring
     * rather than relocating it would trade an ugly box for an unusable field.
     */
    surfaceFocused: {
      boxShadow: `inset 0 0 0 1px ${token.colorPrimary}`,
    },
    /** Lining figures, so the digits do not shuffle as the number grows. */
    value: {
      fontWeight: 600,
      lineHeight: 1.2,
      fontVariantNumeric: "tabular-nums",
      transition: "font-size 120ms ease",
    },
  }) satisfies Record<string, CSSProperties>;
