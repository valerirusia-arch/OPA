// src/features/Loan/ui/LoanJourney.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * The marker's disc.
 *
 * 34, and it was 20. A 20px dot with a tick in it is a bullet; at 34 with the
 * step's own icon in it the marker is the thing the eye lands on, and the
 * panel stops being four words against a white wall — *"ესეთი ცარიელი არ
 * იყოს"*.
 */
const MARKER = 34;
/** The dimmed ring around it. Drawn as a spread shadow, so it adds mass
 *  without adding size and never shifts the line running through the disc. */
const HALO = 5;

export const styles = {
  markerColumn: { width: MARKER, flex: "none", alignSelf: "stretch" },
  /**
   * The gap under a step, and therefore the length of its connector.
   *
   * IT IS THE COPY'S PADDING, NOT THE ROW'S. On the row it sat outside the
   * box `alignSelf: stretch` stretches to, so the marker column was exactly
   * as tall as its own disc, the connector's `flex: 1` had nothing left to
   * fill, and the rail drew four markers with no rail between them.
   */
  copy: { flex: 1, minWidth: 0, paddingTop: 6, paddingBottom: 50 },
  /** Nothing hangs below the last marker, so nothing pads it. */
  copyLast: { flex: 1, minWidth: 0, paddingTop: 6 },
  /** The title and its context line, held together against the date. */
  words: { minWidth: 0 },
  content: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const disc: CSSProperties = {
    width: MARKER,
    height: MARKER,
    borderRadius: "50%",
    flex: "none",
    boxSizing: "border-box",
    fontSize: 15,
  };

  const line: CSSProperties = {
    width: 0,
    flex: 1,
    /* Clear of the halo at both ends, not just of the disc. */
    marginBlock: HALO + 4,
  };

  return {
    /** Behind you. */
    done: {
      ...disc,
      background: token.colorSuccess,
      color: token.colorWhite,
      boxShadow: `0 0 0 ${HALO}px ${token.colorSuccessBg}`,
    },
    /** Where you are. Same shape, the accent's colour — and the bold title
     *  beside it is the second carrier, so the two dark discs never have to
     *  be told apart by hue alone. */
    current: {
      ...disc,
      background: token.colorPrimary,
      color: token.colorWhite,
      boxShadow: `0 0 0 ${HALO}px ${token.colorPrimaryBg}`,
    },
    /** Ahead. The step exists and nothing has happened in it, so the disc is
     *  the page's own fill and the icon is the quietest ink there is. */
    ahead: {
      ...disc,
      background: token.colorFillSecondary,
      color: token.colorTextQuaternary,
      boxShadow: `0 0 0 ${HALO}px ${token.colorFillQuaternary}`,
    },
    /** The one outcome nobody wanted — declined, cancelled. */
    failed: {
      ...disc,
      background: token.colorError,
      color: token.colorWhite,
      boxShadow: `0 0 0 ${HALO}px ${token.colorErrorBg}`,
    },
    /**
     * The road travelled: both ends of this segment are behind the reader.
     *
     * NOT `colorSplit`. That token is the product's hairline and it is right
     * for one: a 1px line running the width of a card reads at 11% ink. The
     * same value in a 2px column is a smudge nobody can see — measured, it
     * rendered and was invisible.
     */
    connectorDone: { ...line, borderInlineStart: `2px solid ${token.colorBorder}` },
    /** The road not yet travelled, including the one INTO the step the reader
     *  is standing in: that step has been reached but not finished. */
    connectorAhead: { ...line, borderInlineStart: `2px dotted ${token.colorBorder}` },
    /** Behind you: stated plainly, not greyed out. It happened. */
    titleDone: { fontWeight: 400, color: token.colorText },
    /** Where you are: the only weight on the rail. */
    titleCurrent: { fontWeight: 600, color: token.colorText },
    /** Ahead: quiet, because nothing has happened in it yet. */
    titleAhead: { fontWeight: 400, color: token.colorTextTertiary },
    titleFailed: { fontWeight: 600, color: token.colorError },
    /** The date at the row's far edge. Tabular so four of them line up digit
     *  for digit, and quiet: it dates the step, it is not the step. */
    meta: {
      fontSize: 13,
      flex: "none",
      fontVariantNumeric: "tabular-nums",
      color: token.colorTextTertiary,
    },
  } satisfies Record<string, CSSProperties>;
};
