// src/flows/staff-applications/application-details/ApplicationDetailsScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

const ROW_PAD = 16;

export const styles = {
  /**
   * The tab bar sits INSIDE the card's body, under the head's own rule.
   *
   * The rule went away for a pass, on the argument that it doubled with the
   * bar's. The designer wants it back: a title separated from what follows it
   * is how every other card on this page reads, and a rule, the tabs, and the
   * bar's own line are a title and then a control — which is what they are.
   * *"ეს დააბრუნე როგორც იყო, სტროუკი ჰქონდა."* The pull-up goes with it, so
   * the bar keeps the body's own top padding and hangs below the rule instead
   * of against it.
   */
  checksTabs: { marginTop: 0 },
  /** A link button with antd's own padding taken off, so it ends the panel's
   *  row rather than floating in from its edge. */
  recordLink: { paddingInline: 0, height: "auto" },
  /* The card head's own action, the shape every other head in the product
     uses: a link with its arrow, flush to the card's right edge. */
  headAction: { paddingInlineEnd: 0 },
  /** The cards down the page, all on one rhythm. */
  card: { marginBottom: 24 },
  /** The decision banner sits above everything, before the record itself. */
  banner: { marginBottom: 24 },
  amount: { fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  /** The requested figure, struck through once an underwriter has changed it. */
  amountWas: { textDecoration: "line-through", fontVariantNumeric: "tabular-nums" },
  /**
   * ONE RECORD ROW — the audit trail and the information requests, which are
   * the same shape and were spaced like single lines.
   *
   * Each row carries up to three: what happened, the figures it moved between,
   * and the reason. At 12 above and below, with the three set solid and a
   * Divider between rows, a row's own lines sat closer to the NEXT row's than
   * to each other and the whole card read as one grey block. 16 and a 4 gap
   * are what the verification list and the dashboard's own record list
   * settled on. *"აქ სფეისინგი მოაგვარე."*
   *
   * The rule is the row's own border rather than a Divider element, so it
   * carries no line box of its own and the first row does not get one.
   */
  recordRowFirst: { width: "100%", paddingBlock: ROW_PAD },
  /** It follows the record grid rather than opening the card, so it keeps the
   *  grid's own row gap above it and nothing below. */
  note: { marginTop: 24, marginBottom: 0 },
  meta: { fontSize: 13 },
  documents: { paddingBlock: 4 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** Every record row but the first: hairlines BETWEEN rows, none under the
     *  last, which would be a rule with nothing beneath it. */
    recordRow: {
      width: "100%",
      paddingBlock: ROW_PAD,
      borderTop: `1px solid ${token.colorSplit}`,
    },
    /** A quiet frame for the borrower's answer to a request. */
    answer: {
      marginTop: 12,
      padding: token.paddingSM,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
    },
    sectionTitle: { fontWeight: 500 },
  }) satisfies Record<string, CSSProperties>;
