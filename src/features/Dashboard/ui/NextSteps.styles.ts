// src/features/Dashboard/ui/NextSteps.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Fills the row it shares with the journey rail. */
  card: { height: "100%" },
  /**
   * The date column.
   *
   * Fixed, so every row's date starts and ends at the same x and the eye can
   * run down them. Wide enough for "Sep 16, 2026" at 13px without wrapping;
   * a date that wraps stops being a column.
   */
  whenColumn: { width: 110, flex: "none" },
  copy: { flex: 1, minWidth: 0 },
  /** The first step has nothing above it to be ruled off from, and the card's
   *  own head is already a line. */
  firstRow: { paddingBottom: 18 },
  body: { fontSize: 13 },
  empty: { paddingBlock: 24, textAlign: "center" },
  emptyCopy: { maxWidth: 280 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * THE DATE IS THE ROW'S HEADING, and it is set like one.
     *
     * It was 13px secondary — the weight of a caption — which left every row
     * starting with its quietest element and the panel reading as prose. A
     * borrower scanning this is scanning for WHEN, so the when is the firm
     * thing. Tabular, so the dates line up digit for digit down the column.
     */
    when: {
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      color: token.colorText,
    },
    /**
     * A step, ruled off from the one above it.
     *
     * 18 on each side of the line, so the rule sits BETWEEN two rows rather
     * than under one.
     *
     * `colorBorderSecondary`, not `colorSplit`. Split is the product's
     * quietest hairline and it is right where a line only has to stop two
     * things touching; here the line is the thing that makes each step a
     * record with its own edges, which is what the panel was asked for, and
     * at 11% ink it was doing that invisibly.
     */
    row: { paddingBlock: 18, borderBlockStart: `1px solid ${token.colorBorderSecondary}` },
    /** The one that is running out. Colour, not an icon: the row already has
     *  a tag, and a second mark on the same line is noise. */
    whenUrgent: {
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
      color: token.colorError,
    },
    stepTitle: { fontWeight: 500, color: token.colorText },
    /** The second carrier of "running out", beside the colour. */
    urgentMark: { color: token.colorError, fontSize: 12, flex: "none" },
  }) satisfies Record<string, CSSProperties>;
