// src/features/LoanApplication/ui/CardOnFile.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * Takes the row, and never narrower than the number it holds.
   *
   * `minWidth: 0` let this shrink to nothing, which is what made
   * "•••• •••• •••• 4417" wrap one character at a time in a narrow column.
   * 190px is the number at 16px with its tag beside it; below that the row
   * wraps and the button goes underneath, which is the right answer.
   */
  text: { flex: 1, minWidth: 190 },
  /** Lining figures: the last four are read as digits, not as a word. */
  number: { display: "block", fontSize: 16, fontVariantNumeric: "tabular-nums" },
  meta: { display: "block", fontSize: 13 },
  action: { flex: "none" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A framed row rather than a green receipt.
     *
     * The green strip said "this step went well", which was true for a minute
     * and then stopped being the point. What the borrower needs here is to
     * recognise the card — the brand mark and the last four are how anybody
     * identifies their own — and to be able to change it. So it is drawn as
     * the card ON FILE, not as a notification about the card.
     */
    row: {
      // Fills the panel: the ExternalPanel lays its children out in a row, and
      // a card that sizes to its own content sits in the middle of that row
      // looking like a chip rather than like the card on the account.
      flex: 1,
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorderSecondary}`,
    },
    /**
     * One card mark, whatever the network is.
     *
     * The alternative was the network's colour with its name set in type, and
     * it did not survive contact with the longest name: MASTERCARD at 11px
     * bold is wider than the badge a card mark can be, so it broke its own
     * frame. Licensed logo artwork is not a prototype's to ship either — so
     * the badge carries the generic mark, which sits the same for every card,
     * and the network is named in the line underneath where there is room for
     * the word.
     */
    badge: {
      width: 46,
      height: 30,
      borderRadius: token.borderRadiusSM,
      background: token.colorFillSecondary,
      color: token.colorTextSecondary,
      fontSize: 15,
      flex: "none",
    },
  }) satisfies Record<string, CSSProperties>;
