// src/features/Loan/ui/LoanOverview.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * A table draws its own frame; the card's inset would be a second one.
   *
   * `overflow: hidden` on the ROOT is what keeps the card's bottom corners
   * round. A flush body is a square white rectangle, and it paints straight
   * over the 14px curve unless the card clips it — which is why the table
   * looked pointed at the bottom. Same fix, same reason, as AdminPage's own
   * `tableCard`.
   */
  tableCard: { overflow: "hidden" },
  tableCardBody: { padding: 0 },
  /** A destructive action keeps its own width instead of stretching. */
  action: { flex: "none" },
  /** The empty page's card: room above and below the illustration, and the
   *  same inset as the cards it replaces. */
  emptyBody: { paddingBlock: 40 },
  /** The copy in the exit row wraps rather than pushing the button off. */
  exitCopy: { flex: "1 1 320px", minWidth: 0 },
  /** 24 under the row that carries the answer and the card: the gap between
   *  blocks. The cards inside it own no margin of their own. */
  row: { marginBottom: 24 },
  /** Makes the Col a flex container, so the card inside it can grow to the
   *  row's height. See LoanStatement.styles for the rest of the chain. */
  column: { display: "flex" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The page's FOOT, and the one break in its rhythm.
     *
     * Leaving the loan is a different kind of thing from reading a schedule or
     * downloading a document, so it is set apart rather than framed: 40 above
     * it — where every other gap on this page is 24 — a hairline, then 24 of
     * air before the words. A card here would say the two things weigh the
     * same.
     */
    exit: {
      marginTop: 40,
      paddingTop: 24,
      borderTop: `1px solid ${token.colorBorder}`,
    },
    /**
     * The exit row has no card head, so its first line IS the head — and it is
     * set like one: the same 16/600 as "Documents" above it.
     */
    sectionTitle: { fontSize: 16, fontWeight: 600, color: token.colorText },
  }) satisfies Record<string, CSSProperties>;
