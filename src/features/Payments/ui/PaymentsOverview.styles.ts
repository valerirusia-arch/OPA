// src/features/Payments/ui/PaymentsOverview.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The margin the card's own contents keep from its edge. */
const CARD_INSET = 24;

export const styles = {
  /** In the head: no end padding, so the link aligns with the head's own edge
   *  — the same as /loan's two panels. */
  headAction: { paddingInlineEnd: 0 },
  /** The account's notice, above everything it is about. */
  card: { marginBottom: 24 },
  row: { marginBottom: 24 },
  /** The answer's zone and the facts' zone, an even share each. `minWidth: 0`
   *  so neither widens the row to fit its longest word. */
  answer: { flex: "1 1 0", minWidth: 0 },
  facts: { flex: "1 1 0", minWidth: 0 },
  /**
   * Equal-height cards, done with flex rather than percentage heights.
   *
   * `height: 100%` on a Card was wrong twice over, and I shipped it twice
   * before measuring properly: a Card is head + body, so a box forced to the
   * ROW's height leaves the body only `rowHeight - head`, and any body taller
   * than that spills out the bottom. It escaped by exactly 27px on both
   * breakpoints — the amount the head took.
   *
   * The chain that actually works: the Col becomes a flex container, the Card
   * grows inside it, and the Card is itself a flex column whose BODY takes the
   * remainder. The head keeps its own height, the body gets what is left, and
   * a flex item never shrinks below its content unless told to.
   */
  column: { display: "flex" },
  stretchCard: { flex: 1, display: "flex", flexDirection: "column" },
  fillBody: { flex: 1, display: "flex", flexDirection: "column" },
  /** Clips the flush table to the card's radius; without it the last row
   *  squares off the bottom corners. */
  tableCard: { overflow: "hidden" },
  tableCardBody: { padding: 0 },
  tabBar: { paddingInline: CARD_INSET, marginBottom: 0 },
  /** The settled schedule's own state, on the card's margin like the rules
   *  block it replaces. */
  settled: { padding: CARD_INSET },
  /** The late-fee rules, under the schedule and back on the card's margin. */
  rulesBlock: { padding: CARD_INSET, paddingTop: 8 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** Reference material: a heading weight, but it opens like a link. */
    rulesLabel: { fontWeight: 500, color: token.colorText },
    /**
     * THE LINE BETWEEN THE ANSWER AND ITS FACTS.
     *
     * antd's vertical Divider is sized for inline use — 0.9em tall, with
     * horizontal margins — so it drew a short tick between two tall blocks.
     * `alignSelf: stretch` plus `height: auto` makes it the height of the
     * row, which is what a split is. Its margins go, because the Flex gap
     * already spaces the zones and a margin on top of it doubles the gutter
     * on one side only.
     */
    splitVertical: {
      alignSelf: "stretch",
      height: "auto",
      margin: 0,
      borderInlineStartColor: token.colorSplit,
    },
    /** Stacked, the same line turned. The gap does the spacing, so the rule
     *  keeps none of antd's own 24. */
    splitHorizontal: { margin: 0, borderBlockStartColor: token.colorSplit },
  }) satisfies Record<string, CSSProperties>;
