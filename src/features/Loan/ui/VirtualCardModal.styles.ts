// src/features/Loan/ui/VirtualCardModal.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The note under the list: what pressing the button does, or — once it has
   *  been pressed — whose details are on screen. */
  note: { display: "block", marginTop: 16, fontSize: 13 },
  /** The card sits below the title with its own air. */
  face: { marginTop: 16 },
  /**
   * THE CARD IS SMALLER HERE THAN ON THE PAGE, and centred.
   *
   * On /loan the card IS the panel and takes its whole width. In this dialog
   * it is the picture at the head of a list of facts — the reference's own
   * arrangement — and a full-width card face above five rows of data makes
   * the data look like a caption.
   *
   * 360, measured rather than picked. The foot of the nameplate has to hold
   * the card's name and its state on one line: at 320 the row is 272 wide
   * inside the face's insets, the pill takes ~90 and the gap 16, which leaves
   * 166 for a name that wants ~165 — and it wrapped. 360 leaves 206, and the
   * card is still comfortably inside the 520 dialog at the ID-1 proportion
   * the face sets.
   */
  faceSize: { width: 360, maxWidth: "100%" },
  /**
   * The hand-off caption under the revealed list.
   *
   * Its own style, not `note`: that one carries `marginTop: 16` for a line
   * that follows a block, and inside a row beside the padlock the same margin
   * pushed the words 16px below the icon. The row's own gap does it here.
   */
  issuerCaption: { fontSize: 13 },
  issuerRow: { marginTop: 16 },
  /** A row's value and its copy affordance share a line. */
  rowValue: { width: "100%" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The padlock beside USIO's name: a mark, not a warning. */
    issuerIcon: { color: token.colorTextTertiary },
    /**
     * THE LIST, AS ONE BORDERED BLOCK — the reference's arrangement.
     *
     * Five facts laid loose on a dialog read as five paragraphs; inside one
     * rounded frame with hairlines between them they read as a record of one
     * object, which is what they are. The frame is also what tells a reader
     * where the card's own data stops and the dialog's own words begin.
     */
    list: {
      marginTop: 20,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
      overflow: "hidden",
    },
    /** One fact. The rule belongs to the row above it, so the last row has
     *  none and the frame's own edge closes the block. */
    row: { padding: "12px 16px" },
    rowRuled: {
      padding: "12px 16px",
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    rowLabel: { fontSize: 13, color: token.colorTextTertiary, display: "block" },
    rowValue: {
      fontSize: 15,
      fontWeight: 600,
      color: token.colorText,
      letterSpacing: "0.01em",
    },
    /** The number and the security code, before USIO has been asked. Same
     *  size and weight as the values they stand in for, so revealing them
     *  does not move the row. */
    rowMasked: {
      fontSize: 15,
      fontWeight: 600,
      color: token.colorTextTertiary,
      letterSpacing: "0.08em",
    },
    /** The mark beside "OPA Virtual Card" in the type row — the reference puts
     *  the network's badge here; OPA's card carries OPA's. */
    typeMark: {
      flex: "none",
      display: "flex",
      background: token.colorFillQuaternary,
      borderRadius: token.borderRadiusSM,
      padding: 4,
    },
  }) satisfies Record<string, CSSProperties>;
