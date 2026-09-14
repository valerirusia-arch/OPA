// src/features/Dashboard/ui/StageTrack.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The capsule's height. Thick enough to carry a fill that reads at a glance,
 *  thin enough that five of them are a measure and not five buttons. */
const BAR = 8;

export const styles = {
  /**
   * THE RAIL SCROLLS BEFORE IT CRUSHES.
   *
   * Five steps across a phone is a 55px column holding a word, and measured
   * at 375 it did exactly what that arithmetic predicts: "Submitted" came out
   * "Submi…". A rail whose labels are cut short is not a rail.
   *
   * There is no media query available here — styles are typed `CSSProperties`
   * and this project has no stylesheet — and the breakpoint hook has already
   * been caught reporting the wrong layout in this codebase. So the mechanism
   * is the one that needs neither: a floor under the track and `auto` on the
   * box around it. Above ~545px of card interior nothing scrolls at all,
   * which covers every desktop and tablet; below it the reader pushes the
   * rail rather than reading a broken one.
   *
   * 480 is measured, not guessed, and it is SPANISH that sets it: the widest
   * label in either language is "Desembolso" at 80px in this face at 13/600.
   * 480/5 leaves each column 96.
   */
  scroller: { width: "100%", overflowX: "auto" },
  track: { width: "100%", minWidth: 480 },
  /**
   * Equal shares. `minWidth: 0` lets a column hold its own width rather than
   * being widened by the longest word in the row.
   */
  cell: { flex: 1, minWidth: 0 },
  /** The destination marker takes only the width of its own words — an equal
   *  share would make it the fifth column of a four-column rail, which is the
   *  reading it exists to avoid. `flex-start` in the track puts it on the
   *  label row, where it belongs: named, not measured. */
  goalCell: { flex: "none", paddingLeft: 4 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const bar: CSSProperties = { width: "100%", height: BAR, borderRadius: BAR };
  const label: CSSProperties = { fontSize: 13, whiteSpace: "nowrap" };

  return {
    /**
     * THREE MATERIALS, AND THE COLOUR IS WHAT SAYS WHICH.
     *
     * The rail was one colour, the accent, and "filled" meant "this has
     * happened" — which left the step the reader is standing on drawn exactly
     * like the three ahead of it. A rail whose whole job is to answer "where
     * am I" was answering it in bold type and nothing else.
     *
     * So a full capsule now means REACHED, and its colour says what kind:
     *
     *   green   closed and confirmed. *"რომელიც ჩაიხურება და დადასტურდება,
     *           ის გაამწვანე."* It is also the product's own "done" — every
     *           Paid tag, every signed document, the repayment segments.
     *   grey    not reached. Which includes the step you are STANDING on:
     *           being in the middle of something is not having finished it,
     *           and a filled capsule on the live step said it was closed.
     *           The blue was tried and sent back — *"ჯობს ლურჯის ნაცვლად
     *           ისევ ნაცრისფერი იყოს ის სტეპი, რომელზეც ვარ."*
     *
     * WHERE YOU ARE IS IN THE TYPE, then, and only there: the live step's
     * label is the one word on the rail set in the accent at 600. The rail
     * reports what has closed; the words report where you stand.
     *
     * Still no half fill anywhere: nothing in this system knows how far
     * through a step an application is.
     */
    barDone: { ...bar, background: token.colorSuccess },
    barAhead: { ...bar, background: token.colorBorder },
    barFailed: { ...bar, background: token.colorError },

    /** Behind you: plain, because it happened. */
    labelDone: { ...label, color: token.colorText },
    /**
     * Where you are: the only weight on the rail, and now the only colour in
     * its type as well.
     *
     * Weight alone was carrying it, and against four other labels at the same
     * size that is a difference you have to look for. The accent on the word
     * and the accent on the capsule under it are the same signal said twice,
     * which is what you want for the one thing a reader came to find out.
     */
    labelCurrent: { ...label, fontWeight: 600, color: token.colorPrimary },
    /** Ahead: quiet, and quiet here is the AA-passing token rather than a
     *  grey chosen for looking light. */
    labelAhead: { ...label, color: token.colorTextTertiary },
    labelFailed: { ...label, fontWeight: 600, color: token.colorError },

    /** Quieter than any step on the rail, including the ones already behind
     *  the reader. It is the only thing in the row that has not happened and
     *  is not a stage, so it should not compete with either. */
    goal: { ...label, color: token.colorTextTertiary },
    goalMark: { fontSize: 11, color: token.colorTextQuaternary },
  } satisfies Record<string, CSSProperties>;
};
