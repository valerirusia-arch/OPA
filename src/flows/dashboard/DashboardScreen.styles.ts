// src/flows/dashboard/DashboardScreen.styles.ts

import type { CSSProperties } from "react";
import { contentRow } from "../../shared/ui/grid";

export const styles = {
  /** In a card's head: no end padding, so the link aligns with the head's own
   *  edge — the same as /loan's and /payments' panels. */
  headAction: { paddingInlineEnd: 0 },
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
  /**
   * The band with nothing in it yet.
   *
   * The inset used to come from `Grid.useBreakpoint()` — 48 wide, 32 narrow —
   * which is JS deciding a number CSS can interpolate, and this environment's
   * breakpoint hook has already been caught reporting the wrong column count.
   * `clamp` crosses the same range continuously and needs no render to know
   * the width.
   */
  empty: { paddingBlock: "clamp(24px, 4vw, 36px)", textAlign: "center" },
  emptyCopy: { maxWidth: 420 },
  /** A table fills its card to the edges: the rows have their own inset and a
   *  second one around them reads as a table inside a box. */
  tableBody: { padding: 0 },
  /** …and the card clips it, so the last row takes the frame's own corners
   *  instead of squaring them off inside it. */
  tableCard: { marginBottom: 24, overflow: "hidden" },
} satisfies Record<string, CSSProperties>;
