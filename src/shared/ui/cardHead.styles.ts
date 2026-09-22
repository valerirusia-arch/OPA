// src/shared/ui/cardHead.styles.ts
//
// A CARD TITLE THAT WRAPS INSTEAD OF BEING CUT SHORT.
//
// antd's card head puts the title and the `extra` action on one line, gives the
// action the width it asks for, and ellipsises the title with whatever is left:
// `.ant-card-head-title` ships `white-space: nowrap; overflow: hidden;
// text-overflow: ellipsis`. On a wide screen there is room for both and nobody
// notices. On a phone the dashboard's lead card read
//
//     Where your l…            Make a payment →
//
// — the card's own subject truncated so a secondary link could be drawn whole.
// The wrong one gave way: a person can guess what "Make a payment" does from
// half of it, and cannot guess what card they are looking at.
//
// So the title wraps. The head grows by a line on narrow screens and keeps its
// single line everywhere else, which is why this is safe to apply everywhere
// rather than behind a breakpoint — there is nothing to wrap until the row runs
// out of room.
//
// Applied as `styles={{ title: cardHeadTitle }}` on every Card that carries an
// action beside its title.

import type { CSSProperties } from "react";

export const cardHeadTitle: CSSProperties = {
  whiteSpace: "normal",
  overflow: "visible",
  textOverflow: "clip",
};
