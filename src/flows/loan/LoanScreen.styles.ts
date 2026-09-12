// src/flows/loan/LoanScreen.styles.ts

import type { CSSProperties } from "react";
import { contentRow } from "../../shared/ui/grid";

export const styles = {
  page: { paddingBlock: 40 },
  column: contentRow,
  /**
   * The heading and the two status tags share a line, per the wireframe.
   *
   * 16 under it, not 24. The strip below is the heading's own summary — the
   * four facts "Manage loan" promises — so the two belong together, and the
   * gap between them has to be SMALLER than the gaps between the page's
   * blocks. Every gap on this page was 24 and it read as five equal cards in
   * a stack with no groups; the rhythm is 16 inside a group, 24 between
   * blocks, 40 before the footer.
   */
  titleRow: { marginBottom: 16 },
  title: { marginTop: 0, marginBottom: 0 },
} satisfies Record<string, CSSProperties>;
