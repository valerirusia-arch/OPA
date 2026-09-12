// src/flows/dashboard/DashboardScreen.styles.ts

import type { CSSProperties } from "react";
import { contentRow } from "../../shared/ui/grid";

export const styles = {
  /** THE SAME FRAME AS /loan AND /payments, from the same constant. It was a
   *  hand-rolled 1216 at 32, which is 48px narrower and 8px higher than the
   *  two pages this one sits between — three widths for one product. */
  page: { paddingBlock: 40 },
  column: contentRow,
  /** 16 under the heading block, matching /loan and /payments. The greeting
   *  carries a second line, so the gap is measured from the block. */
  greeting: { marginBottom: 16 },
  title: { marginTop: 0, marginBottom: 0 },
  /** One rhythm between bands: the page is four of them and an uneven gap
   *  between two would read as a grouping that is not there. */
  band: { marginBottom: 24 },
  /** Matches the panel beside it. One of the two framed and the other bare
   *  reads as an oversight, not as a decision. */
  journeyCard: { height: "100%" },
  /** A table fills its card to the edges: the rows have their own inset and a
   *  second one around them reads as a table inside a box. */
  tableBody: { padding: 0 },
  empty: { paddingBlock: 48, textAlign: "center" },
  /** An empty panel inside the two-up row: shorter, because it shares its
   *  height with the panel beside it. */
  panelEmpty: { paddingBlock: 24, textAlign: "center" },
  emptyNarrow: { paddingBlock: 32, textAlign: "center" },
  emptyCopy: { maxWidth: 420 },
} satisfies Record<string, CSSProperties>;
