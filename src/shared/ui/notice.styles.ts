// src/shared/ui/notice.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * A PAGE'S ONE NOTICE — soft, rounded, and light.
 *
 * These were once antd Alerts as antd draws them (a tinted slab, a 1px ring in
 * the state's hue, a bold title), then stripped all the way back to a bare
 * icon and a sentence with no panel at all. The bare version read as thrown-in
 * — *"ამ ალერტებს უნდა ვუშველოთ... უფრო შევალამაზოთ, უფრო საინტერესო, მაგრამ
 * მსუბუქი."* So the panel comes back, but as the product's own soft surface
 * rather than antd's default alert:
 *
 *   · the state's own PALE tint for the ground (antd's per-type background,
 *     kept — it is already light);
 *   · a VERY LIGHT NEUTRAL hairline, not the type's own hue. A tinted panel on
 *     the near-white page has almost no edge and reads as spilled ink — *"ომ
 *     რე ბექგრაუნდზე ცუდად ზის"* — so it needs an outline, but the coloured
 *     ring antd draws is exactly the heavy part; `colorSplit` (6% ink) defines
 *     the edge without shouting;
 *   · the product's large radius, so it reads as one of this app's rounded
 *     cards and not a system banner;
 *   · the mark left as the bare per-type glyph. It carried a white chip for a
 *     while and the designer took it off — *"ამას უკან თეთრი ბექგრაუნდი არ
 *     სჭირდება"* — so the one spot of the state's colour is the icon itself,
 *     on the tint, nothing behind it.
 *
 * The colour of the glyph and the ground stay antd's per-type values, so one
 * component still covers success / info / warning / error from the `tone` prop.
 */
export const getNoticeStyles = (token: GlobalToken) =>
  ({
    /**
     * The panel: the type's pale tint, the product's large radius, a card's
     * inset, and a neutral hairline so its edge reads on the page.
     *
     * `flex-start` keeps the mark on the FIRST line — antd centres a title-only
     * alert's icon against the whole block, which floats it between the lines
     * the moment the copy wraps.
     */
    notice: {
      border: `1px solid ${token.colorSplit}`,
      borderRadius: token.borderRadiusLG,
      padding: "14px 16px",
      marginBottom: 24,
      alignItems: "flex-start",
    },
    /**
     * The mark: the bare per-type glyph, nothing behind it. A hair of top
     * margin drops a 16px icon's centre onto the copy's first line (14 × 1.6 =
     * 22.4), and it never shrinks when the sentence wraps.
     */
    icon: {
      flex: "none",
      fontSize: 16,
      marginInlineEnd: 12,
      marginTop: 3,
    },
    /** The sentence, at the page's own body measure — not antd's tighter
     *  alert line-height, which packs a two-line notice too close. */
    message: {
      color: token.colorText,
      lineHeight: token.lineHeight,
    },
  }) satisfies Record<string, CSSProperties>;
