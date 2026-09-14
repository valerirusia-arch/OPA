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
  /**
   * THE BOTTOM INSET IS NOT ZERO ANY MORE.
   *
   * It was `24px 24px 0`, which left whatever ended the tab sitting on the
   * card's own edge — measured at 1px between the last control and the frame.
   * The other three tabs end in a form whose own margin covered for it; the
   * loan tab ends in a comment, and it showed.
   */
  tabBody: { padding: CARD_INSET },
  /** The way through to the loan's own record, under its summary. */
  /** The loan's state and the way to its full record, on one line above the
   *  fields. A state is not a field and a way out is not a comment — see the
   *  note in the tab. */
  loanState: { marginBottom: 20, width: "100%" },
} satisfies Record<string, CSSProperties>;
