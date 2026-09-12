// src/flows/staff-borrowers/borrower-details/BorrowerDetailsScreen.styles.ts

import type { CSSProperties } from "react";

/** The margin the card's own contents keep from its edge. */
const CARD_INSET = 24;

export const styles = {
  /**
   * The card carries no padding of its own so the tab bar's rule runs edge to
   * edge, the way the tables' header band does. The tab bar and the record
   * below it bring the inset back.
   */
  card: { overflow: "hidden" },
  /** Clips the flush tabs and tables to the card's radius. */
  cardClip: { overflow: "hidden" },
  cardBody: { padding: 0 },
  tabBar: { paddingInline: CARD_INSET, marginBottom: 0 },
  /** The last row of the grid already carries its own 24px underneath. */
  tabBody: { padding: `${CARD_INSET}px ${CARD_INSET}px 0` },
  /** The way through to the loan's own record, under its summary. */
  loanLink: { marginTop: 24 },
} satisfies Record<string, CSSProperties>;
