// src/features/Loan/ui/VirtualCardModal.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The note under the card: what pressing the button does, or — once it has
   *  been pressed — whose details are on screen. */
  note: { display: "block", marginTop: 16, fontSize: 13 },
  /** The card sits below the title with its own air. */
  face: { marginTop: 16 },
  /**
   * The hand-off caption under the revealed card.
   *
   * Its own style, not `note`: that one carries `marginTop: 16` for a line
   * that follows a card, and inside a row beside the padlock the same margin
   * pushed the words 16px below the icon — which is what "not aligned" was.
   * The row's own gap does the spacing here.
   */
  issuerCaption: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The padlock beside USIO's name: a mark, not a warning. */
    issuerIcon: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
