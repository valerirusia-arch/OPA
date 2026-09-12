// src/shared/ui/StatusPill.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The dot's size. Small enough to be punctuation, big enough to have colour. */
const DOT = 6;

export const getStyles = (token: GlobalToken) => {
  const dot: CSSProperties = {
    width: DOT,
    height: DOT,
    borderRadius: "50%",
    flex: "none",
  };

  /**
   * THE EDGE THAT MAKES A PALE PILL READ.
   *
   * antd's filled Tag is a tint of the status colour with no border, and the
   * tints are faint by design — "Approved" in green on green, on a page whose
   * own ground is a light grey, comes out as a soft smudge with a dot in it.
   * *"ნარინჯისფერი და მწვანე კარგად არ ჩანს."*
   *
   * ONE NEUTRAL HAIRLINE, NOT THE HUE'S OWN. Two passes of this used antd's
   * derived `colorSuccessBorder` and then `…BgHover`, and both came out as a
   * hard green ring: the brand's success is a DARKENED green (see tokens.ts),
   * so every step antd derives from it is heavier than the step number
   * suggests, and the pill started reading as a button. *"ძაან მძიმე
   * სტროუკებია."*
   *
   * So the edge carries no hue at all. The product's own split colour gives
   * the shape a boundary against both the grey ground and a white card; the
   * fill, the dot and the word carry the meaning, which is what they were
   * already doing. One line for every tone, which is also one fewer decision
   * per status.
   */
  const edge: CSSProperties = {
    border: `1px solid ${token.colorSplit}`,
    fontWeight: 500,
    paddingBlock: 1,
  };

  return {
    /**
     * The label weight. antd's Tag is 12px/400 — at that weight a status
     * reads as a caption, and these are the words a borrower scans a table
     * for. 500 is the step the product uses everywhere something is a value
     * rather than a description.
     */
    tag: { fontWeight: 500, paddingBlock: 2 },
    edge,
    /** The dot and the word are one line, whatever the line-height does. */
    inner: { display: "inline-flex" },
    dotSuccess: { ...dot, background: token.colorSuccess },
    dotError: { ...dot, background: token.colorError },
    dotWarning: { ...dot, background: token.colorWarning },
    dotProcessing: { ...dot, background: token.colorPrimary },
    /** Neutral: the ordinary middle of a process, not a colour worth
     *  spending. It still gets a dot, so it is visibly a STATE. */
    dotNeutral: { ...dot, background: token.colorTextQuaternary },
  } satisfies Record<string, CSSProperties>;
};
