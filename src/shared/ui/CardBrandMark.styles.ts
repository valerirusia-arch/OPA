// src/shared/ui/CardBrandMark.styles.ts

import type { CSSProperties } from "react";
import { brand } from "../../theme/tokens";

/**
 * One height for every network, whatever shape it is.
 *
 * A mark that changes size with the brand makes the card jump between two
 * borrowers' records. 20 is the cap height of the label this replaced, so the
 * card's top line sits exactly where it always did.
 */
export const MARK_HEIGHT = 20;

export const getStyles = (onDark: boolean) => {
  const ink = onDark ? brand.cardDarkInk : "inherit";
  return {
    /** `block` so the svg does not sit on a text baseline and push the row. */
    mark: { display: "block", flex: "none" },
    /**
     * The official file. Height is fixed and width follows the artwork, so a
     * wide wordmark and a square symbol sit on one line without either being
     * squashed to the other's proportions.
     */
    artwork: { height: MARK_HEIGHT, width: "auto", display: "block" },
    /** antd's Image wraps its img; the wrapper has to stop being a block of
     *  its own width or it pushes the status pill off the row. */
    artworkWrapper: { height: MARK_HEIGHT, flex: "none", lineHeight: 0 },
    /**
     * THE STAND-IN FOR THE VISA WORDMARK — see the note in the component.
     *
     * Set at the mark's own height, heavy and tight, because that is what the
     * real logotype reads as at this size: a short dense block of caps, not a
     * line of interface text. It is deliberately NOT a trace of the real
     * letterforms.
     */
    wordmark: {
      display: "block",
      flex: "none",
      fontSize: 17,
      lineHeight: `${MARK_HEIGHT}px`,
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
      color: ink,
    },
    /** Any other network: the name, quietly, at the label's own treatment. */
    word: {
      display: "block",
      flex: "none",
      fontSize: 11,
      lineHeight: `${MARK_HEIGHT}px`,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: onDark ? brand.cardDarkQuiet : "inherit",
    },
  } satisfies Record<string, CSSProperties>;
};
