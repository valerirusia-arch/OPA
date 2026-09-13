// src/features/Dashboard/ui/StageTrack.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * The node, at 28.
 *
 * It was 18, drawn inside a tinted well as a diagram BELONGING to a panel
 * that carried the message. The rail is the message now — it is the first
 * thing in the band and it runs the full width of the page — so the node is
 * sized as the thing you look at rather than as a footnote to it. 28 is also
 * the smallest disc that holds a legible numeral with air around it.
 */
const NODE = 28;
/** The capsule's height in the `bars` variant. Thick enough to carry a fill
 *  that reads at a glance, thin enough that five of them are a measure and
 *  not five buttons. */
const BAR = 8;

export const styles = {
  /**
   * THE RAIL SCROLLS BEFORE IT CRUSHES.
   *
   * Five steps across a phone is a 60px column holding a word and a date, and
   * measured at 375 it did exactly what that arithmetic predicts: "Submitted"
   * came out "Submi…", "Sep 05, 2026" wrapped to two lines, and because only
   * the first three steps carry a date the five capsules stopped sharing a
   * baseline. A rail that is out of line is not a rail.
   *
   * There is no media query available here — styles are typed `CSSProperties`
   * and this project has no stylesheet — and the breakpoint hook has already
   * been caught reporting the wrong layout in this codebase. So the mechanism
   * is the one that needs neither: a floor under the track and `auto` on the
   * box around it. Above ~530px of card interior nothing scrolls at all,
   * which covers every desktop and tablet; below it the reader pushes the
   * rail rather than reading a broken one.
   *
   * 480 is measured, not guessed, and it is SPANISH that sets it: the widest
   * label in either language is "Desembolsado" at 80px in this face at 13/600,
   * against 58px for the longest English one. 480/5 leaves each column 96 —
   * 80 for the word, 8 either side, and the dates (58px English, 57 Spanish)
   * fit inside the same column.
   */
  scroller: { width: "100%", overflowX: "auto" },
  track: { width: "100%", minWidth: 480 },
  /**
   * Equal shares, so the nodes sit at even intervals whatever the labels
   * under them happen to be. `minWidth: 0` lets a long label wrap rather than
   * widen its own cell and shove the node off centre.
   */
  cell: { flex: 1, minWidth: 0 },
  /** The node's row: the two half-connectors and the node between them. */
  rail: { width: "100%" },
  /**
   * `boxSizing` is not decoration here. antd 6 ships no global reset, so a
   * plain `div` is CONTENT-box: `width: 100%` plus 4px either side made every
   * cell 8px wider than the column it sits in, and the overflow off the last
   * one gave the track a `scrollWidth` 4px past its client width — a
   * horizontal scrollbar on a desktop that has nothing to scroll.
   */
  copy: {
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    paddingTop: 10,
    paddingInline: 4,
  },
  /** Left-aligned in the `bars` variant: the eye travels the row instead of
   *  bouncing between five centres. */
  barCopy: { width: "100%", minWidth: 0 },
  /**
   * THE CARET'S SLOT, HELD OPEN ON EVERY CELL.
   *
   * `display` is stated rather than left to a `Flex`, because four of these
   * five render with no child and an empty antd `Flex` computed to
   * `display: none` here once before — which took the rail out of alignment
   * on exactly the cells that had nothing to say.
   */
  caretSlot: {
    height: 16,
    display: "flex",
    /* Pinned to the BOTTOM of its slot, so the marker sits on the node it is
       pointing at rather than floating halfway to the card's edge. */
    alignItems: "flex-end",
    justifyContent: "center",
  },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const node: CSSProperties = {
    width: NODE,
    height: NODE,
    borderRadius: "50%",
    flex: "none",
    boxSizing: "border-box",
    /* STATED, NOT INHERITED. Measured once at width 18, display none: the
       node for the step you are ON used to render as an empty `Flex`, and an
       empty one collapses — which took the single node the rail exists to
       point at off the page. It carries a numeral now, but the rule stands. */
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  };
  const line: CSSProperties = { flex: 1, height: 2 };
  const bar: CSSProperties = {
    width: "100%",
    height: BAR,
    borderRadius: BAR,
    /* The fill inside the live capsule is a child with its own radius; this
       clips it to the capsule's ends so the two curves agree. */
    overflow: "hidden",
  };

  return {
    /**
     * ONE COLOUR ON THE RAIL, AND IT IS THE ACCENT.
     *
     * Green was the obvious reach and it is the wrong one here: in this
     * product green means money that has been paid — the repayment bar, every
     * "Paid" tag. A journey through underwriting is not money. Blue is the
     * product's single accent and this band is where it belongs, which is
     * also why the step's own action below the rail is an outlined button:
     * one saturated thing in the band, and it is the road.
     */
    nodeDone: { ...node, background: token.colorPrimary, color: token.colorWhite },
    /** Where you are. Same fill as a finished step — the caret above it and
     *  the numeral inside it are what separate the two, not a second colour. */
    nodeCurrent: { ...node, background: token.colorPrimary, color: token.colorWhite },
    /** Ahead: the card's own surface with an outline, which is as close to
     *  "nothing has happened here" as a shape can get. */
    nodeAhead: {
      ...node,
      background: token.colorBgContainer,
      border: `2px solid ${token.colorBorder}`,
      color: token.colorTextTertiary,
    },
    /** Declined, cancelled. */
    nodeFailed: { ...node, background: token.colorError, color: token.colorWhite },
    glyph: { fontSize: 11 },

    /** The marker over the live node. Tinted, because grey would make the one
     *  thing on the rail that answers "where am I" the quietest mark on it. */
    caret: { fontSize: 11, color: token.colorPrimary },
    caretFailed: { fontSize: 11, color: token.colorError },

    lineDone: { ...line, background: token.colorPrimary },
    lineAhead: { ...line, background: token.colorBorder },
    /** The half-line that would otherwise hang off the end of the rail. */
    lineNone: { ...line, background: "transparent" },

    barDone: { ...bar, background: token.colorPrimary },
    /**
     * Under way: the SAME ground as a step still ahead, with the fill drawn
     * over half of it.
     *
     * It was the accent's soft tint, and measured that came out
     * rgb(240,246,255) against rgb(228,232,239) for the steps ahead — LIGHTER
     * than the road the reader has not walked yet, so the live step read as
     * the emptiest thing on the rail. Two materials, not three: grey is "not
     * yet", blue is "done", and the live capsule is the one that is half of
     * each.
     */
    barCurrent: { ...bar, background: token.colorBorder },
    barAhead: { ...bar, background: token.colorBorder },
    barFailed: { ...bar, background: token.colorError },
    /** A convention, not a measurement — see the component. */
    barFill: { width: "50%", height: "100%", borderRadius: BAR, background: token.colorPrimary },

    /** Behind you: plain, because it happened. */
    labelDone: { fontSize: 13, color: token.colorText, whiteSpace: "nowrap" },
    /** Where you are: the only weight on the rail. */
    labelCurrent: {
      fontSize: 13,
      fontWeight: 600,
      color: token.colorText,
      whiteSpace: "nowrap",
    },
    /** Ahead: quiet, and quiet here is the AA-passing token rather than a
     *  grey chosen for looking light. */
    labelAhead: { fontSize: 13, color: token.colorTextTertiary, whiteSpace: "nowrap" },
    labelFailed: {
      fontSize: 13,
      fontWeight: 600,
      color: token.colorError,
      whiteSpace: "nowrap",
    },
    /** The date under the label. Tabular, so five of them read as a row of
     *  dates rather than five different-looking strings. */
    meta: {
      fontSize: 11,
      lineHeight: 1.4,
      color: token.colorTextTertiary,
      fontVariantNumeric: "tabular-nums",
      /* A date is one thing. Wrapped after the month it stopped being one,
         and it took the capsules under it off their shared baseline. */
      whiteSpace: "nowrap",
    },
  } satisfies Record<string, CSSProperties>;
};
