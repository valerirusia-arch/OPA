// src/features/Loan/ui/VirtualCardPanel.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /**
   * Grows inside its Col and lays its head and body out as a flex column, so
   * the body takes the remainder rather than the whole card being squeezed to
   * the row's height. See LoanOverview.styles for why a percentage height on a
   * Card does not work.
   */
  card: { flex: 1, display: "flex", flexDirection: "column" },
  /* A flex COLUMN, not just a growing box: the body has to be a flex
     container for the face-and-note block inside it to take the height and
     centre itself in it. `flex: 1` alone left the block at content height and
     the leftover air all fell to the bottom. */
  fillBody: { flex: 1, display: "flex", flexDirection: "column" },
  /**
   * Sharing a row with the statement, the card is the shorter of the two, so
   * it is handed height it does not need. Centring the face and its note in
   * that height reads as placed; packed at the top it left a block of empty
   * card under the note.
   */
  body: { flex: "1 0 auto" },
  /** In the head: no end padding, so it aligns with the head's own edge. */
  headAction: { paddingInlineEnd: 0 },
  headActionInner: { display: "inline-flex" },
  /** A footnote about who holds the card, at the same step as the payments
   *  page's privacy line under its own card face. */
  note: { fontSize: 13, marginTop: 12 },
} satisfies Record<string, CSSProperties>;
