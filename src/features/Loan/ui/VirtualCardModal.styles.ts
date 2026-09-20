// src/features/Loan/ui/VirtualCardModal.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /**
   * THE CARD AS A THUMBNAIL — 240, down from 360.
   *
   * *"ბარათი არ უნდა იყოს ამხელაზე."* In the reference the card is a small
   * picture at the head of a record, not the subject of the dialog: it says
   * WHICH card and the list under it says everything the card says. At 360 it
   * was 69% of a 520 dialog and read as the point, with five rows of data
   * trailing under it like a caption.
   */
  face: { width: 240, maxWidth: "100%" },
  /**
   * The card clears the close button's row.
   *
   * With no title bar the body starts at the modal's own 20px inset, which
   * put the top of the card level with the X — a dialog whose first object
   * begins in the same line as its chrome. 12 more is the difference between
   * "it fits" and "it was placed".
   */
  head: { marginTop: 12 },
  /** The card's own name, centred under it — the reference's arrangement, and
   *  the reason the thumbnail no longer prints it. */
  title: { marginTop: 18, marginBottom: 0, textAlign: "center" },
  /** The padlock and the sentence. `flex-start`, because the sentence runs to
   *  two lines and an icon centred against both sits between them. */
  issuer: { marginTop: 16 },
  /** Nudges the padlock onto the first line's own optical centre. */
  issuerIconBox: { marginTop: 3 },
  issuerText: { fontSize: 12 },
  /** The number and its copy affordance share a line. */
  rowValue: { width: "100%" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The padlock beside USIO's name: a mark, not a warning. */
    issuerIcon: { color: token.colorTextTertiary, flex: "none" },
    /**
     * THE LIST, AS ONE BORDERED BLOCK — the reference's arrangement.
     *
     * Five facts laid loose on a dialog read as five paragraphs; inside one
     * rounded frame with hairlines between them they read as the record of one
     * object, which is what they are. The frame is also what tells a reader
     * where the card's own data stops and the dialog's own words begin.
     */
    list: {
      marginTop: 20,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: token.borderRadiusLG,
      overflow: "hidden",
    },
    /**
     * One fact. The rule belongs to the row above it, so the last row has none
     * and the frame's own edge closes the block.
     *
     * SET DOWN A STEP, 2026-09-21 — *"ტექსტები ზედმეტად დიდია."* It was a
     * 13px label over a 16px value with 14/18 of padding, which is bigger
     * than anything else in the product says a label-over-value: the loan
     * page's own fact rows are 11 over 15 and the payments tray is 11 over
     * 20. Five rows at 16 made a small dialog read as a form. 12 over 14 is
     * the same relationship, quieter, and the block loses about 60px.
     */
    row: { padding: "11px 16px" },
    rowRuled: {
      padding: "11px 16px",
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    rowLabel: { fontSize: 12, color: token.colorTextTertiary, display: "block" },
    rowValue: {
      fontSize: 14,
      fontWeight: 600,
      color: token.colorText,
      letterSpacing: "0.01em",
    },
    /** The mark beside "OPA Virtual Card" in the type row — the reference puts
     *  the network's badge here; OPA's card carries OPA's. */
    typeMark: {
      flex: "none",
      display: "flex",
      background: token.colorFillQuaternary,
      borderRadius: token.borderRadiusSM,
      padding: 3,
    },
  }) satisfies Record<string, CSSProperties>;
