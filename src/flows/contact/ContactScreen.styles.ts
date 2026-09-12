// src/flows/contact/ContactScreen.styles.ts
//
// Every value here is one the product already uses. The page's problem was
// never its type or its spacing — it was that four unequal facts were drawn
// as four equal cards — so the redesign spends nothing on a new scale.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { contentRow } from "../../shared/ui/grid";
import { getFigureStyles } from "../../shared/ui/figures.styles";

/**
 * The gap under an in-card rule, from the two cards that already draw one:
 * `LoanStatement.styles.rule` and `BalanceSummary.styles.rule` are both
 * `marginBlock: 0, marginBottom: 24`. It was 20 here, which is the kind of
 * difference that makes two pages look like two products.
 */
const RULE_GAP = 24;

export const styles = {
  /** The frame /loan, /payments and /dashboard share, from the same constant. */
  page: { paddingBlock: 40 },
  column: contentRow,
  /** 16 under the heading, the gap every other page in the product uses. */
  header: { marginTop: 0, marginBottom: 16 },
  /**
   * 24 under the two channels, the page rhythm's own gap between blocks.
   *
   * It was 40, spent on saying the postal row is a footnote — but the row
   * already says that by being one quiet line where the two above it are
   * panels, and 40 on a page this short reads as a hole rather than as a
   * demotion.
   */
  band: { marginBottom: 24 },
  /**
   * Equal heights, and equal FEET.
   *
   * `height: 100%` alone makes the two cards the same size; it does not make
   * anything inside them agree. The number is 36px and the address is 20px,
   * so the two panels have copy blocks of different depths and the slack has
   * to go somewhere. The body is a plain column and the FOOTER takes the
   * slack (`marginTop: auto`), which puts every panel's rule and footnote at
   * the same height across the row.
   */
  panel: { height: "100%" },
  panelBody: {
    padding: 24,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  /** Without `minWidth: 0` a flex child refuses to shrink below its content,
   *  and the panel's own copy pushes whatever shares its line off the card. */
  panelCopy: { minWidth: 0 },
  lead: { marginTop: 4 },
  /**
   * The rule and the line under it, pinned to the bottom of the panel.
   *
   * `space-between` used to spread three children, which left the rule
   * floating in the middle of whatever slack the taller card created — so the
   * two panels drew their rules 11px apart and neither belonged to anything.
   *
   * Pinned, the rule keeps a fixed `RULE_GAP` to the footnote it introduces,
   * which is the gap that has to hold; the slack opens ABOVE it, between the
   * channel's copy and the rule, where extra air is only air. `paddingTop`
   * sets the floor for that side so the two never touch on a short card.
   */
  footer: { marginTop: "auto", paddingTop: RULE_GAP },
  rule: { marginBlock: `0 ${RULE_GAP}px` },
  /**
   * One height for both footnote lines.
   *
   * The left panel ends on a Tag and the right on a line of 13px text, and
   * two feet of different depths tilt the rules above them back out of line
   * by exactly that difference — measured, 1.5px, which drew the two rules
   * 2px apart. 26 is the taller of the two, so the shorter one grows to meet
   * it and neither moves.
   */
  footRow: { minHeight: 26 },
  rowText: { fontSize: 13 },
  /** The postal row is a footnote, but it is labelled like everything else on
   *  the page, so it keeps the panels' padding and their left rule. */
  postalBody: { padding: 24 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return {
    /** The product's label treatment, above every value in the app. */
    label: { ...figures.microLabel, display: "block" },
    /**
     * The phone number, at the loan page's headline size.
     *
     * This is the page's one figure, and it is the page's whole argument: a
     * borrower who opens /contact is looking for a person, and the number is
     * how they get one.
     */
    figure: {
      ...figures.figureLg,
      display: "block",
      /* ONE LINE, AT EVERY WIDTH — at `figureLg` wherever that is possible.
         "(800) 555-0142" is 282px at 36px and a phone card at 375 leaves 279,
         so the string has to step down on the smallest phones; broken across
         two lines it stops being a phone number, which is the one thing on
         this page that has to read as a single unit.

         8.8vw is the steepest ramp on which the nowrap string still clears a
         320px window, so the clamp reaches the product's own 36 at 409px and
         holds it from there up — including the whole md-to-lg band, where the
         card goes full width and an earlier 3.4vw was still drawing the
         number at its phone size across 850px of room. */
      fontSize: "clamp(26px, 8.8vw, 36px)",
      whiteSpace: "nowrap",
    },
    /**
     * The email address, one step down.
     *
     * Not `figureLg`: an address at 36px wraps on a laptop, and the second
     * channel setting at the first channel's size would undo the hierarchy
     * the page exists to state.
     *
     * `anywhere`, not `break-all`: the address only needs to break when it
     * genuinely cannot fit, and `break-all` splits it mid-word on every line
     * whether it has to or not.
     */
    figureSm: { ...figures.figure, display: "block", overflowWrap: "anywhere" },
    /** The small marks on the footnote rows. Sized to the line they sit on,
     *  the way `CoBorrowerInvitationScreen`'s `metaIcon` is: an icon a step
     *  larger than its own text reads as a bullet rather than as part of the
     *  sentence. Quiet, because they label a line — they are not the page's
     *  illustration. */
    rowIcon: { color: token.colorTextTertiary, fontSize: 13, flex: "none" },
    /** The address itself — a value, so it takes the product's value weight. */
    postalValue: { fontWeight: 500, color: token.colorText },
  } satisfies Record<string, CSSProperties>;
};
