// src/shared/ui/grid.ts
//
// The page grid, in one place.
//
// The 1440 comp puts 112px between the window edge and the content on both
// sides, so the content column is 1216 wide. Full-bleed chrome — the top bar,
// the wizard's step rail — keeps its background and border edge to edge and
// puts its CONTENTS in this container, so everything on the page lines up on
// the same two vertical rules.

import type { CSSProperties } from "react";

/** Content column at the 1440 comp width. */
export const CONTENT_MAX_WIDTH = 1216;
/** What the gutter collapses to once the window is narrower than the comp. */
export const MIN_GUTTER = 24;

/**
 * Centred content column. The padding is inside the max width, so at 1440 the
 * content starts exactly 112px in, and below that the gutter shrinks with the
 * window instead of clipping.
 */
export const contentRow: CSSProperties = {
  width: "100%",
  maxWidth: CONTENT_MAX_WIDTH + MIN_GUTTER * 2,
  marginInline: "auto",
  paddingInline: MIN_GUTTER,
  boxSizing: "border-box",
};
