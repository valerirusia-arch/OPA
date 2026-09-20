// src/features/Loan/ui/VirtualCardModal.styles.ts
//
// MEASURED AGAINST THE REFERENCE, 2026-09-21 — *"ნახე აქ რა ლამაზად არის
// გაკეთებული."*
//
// The rows were set down a step and the dialog still did not look like it.
// Measuring the reference says why, and it was never the type size on its own:
//
//   its modal        ~720 wide          ours was 480
//   its card         ~177, a QUARTER    ours 240, a half
//   its side inset   ~45                ours 24
//   its row height   ~88                ours ~58
//   title → list     ~64                ours 20
//
// So the reference reads calm because it is ROOMY, not because it is small.
// Its type is actually larger than ours was — a 17px label over a 20px value
// — and it reads quiet because it sits in a container with twice the air.
// Shrinking the text inside a cramped 480 dialog was solving the symptom.
//
// The dialog is 600 now, the card is a fifth of it, the list is inset 32 and
// its rows are 76 tall, and the type went back UP a little from the last pass.
// Same relationship as the reference, at the size this product's type scale
// actually is.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The body's own inset, and what the list is measured against. */
const INSET = 28;

export const styles = {
  /** antd's default body padding is meant for a form; this is a record. */
  body: { padding: INSET },
  /**
   * THE CARD AS A THUMBNAIL — 240 in a 600 dialog.
   *
   * The reference's is a quarter of its dialog, and 150 here would match
   * that. It cannot: the reference's card is a photograph and ours has to
   * print two things along its foot — the holder's name and the card's state
   * — and at 200 the inner width is 172 against a name and a pill that want
   * about that between them, so "Levi Ackerman" broke onto two lines.
   * *"სიგანეში ოდნავ გაზარდე, ზედმეტად წვრილია."* 240 leaves 212 and the
   * foot stays one line for a long name and the longer of the two states.
   */
  face: { width: 240, maxWidth: "100%" },
  /** The body's inset is the air above the card; a second band on top of it
   *  was height the dialog could not afford. */
  head: { marginTop: 0 },
  /** The card's own name, centred under it. */
  title: { marginTop: 14, marginBottom: 0, textAlign: "center" },
  /** The padlock and the sentence. `flex-start`, because the sentence runs to
   *  two lines and an icon centred against both sits between them. */
  issuer: { marginTop: 16 },
  /** Nudges the padlock onto the first line's own optical centre. */
  issuerIconBox: { marginTop: 3 },
  issuerText: { fontSize: 12 },
  /**
   * THE COPY CONTROL AT THE ROW'S FAR EDGE, not tucked against the digits.
   *
   * antd draws `copyable` as a button immediately after the text, which on a
   * 15-digit number puts a small blue glyph in the middle of the row with
   * nothing to align it to. The reference hangs it on the right-hand edge,
   * where a row's action belongs and where the eye finds it without reading
   * the number first. Making antd's own wrapper a space-between flex moves
   * the button without giving up its clipboard or its copied state.
   */
  rowValue: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
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
     * object, which is what they are.
     *
     * `colorSplit` and a 16 radius: the reference's frame is a barely-there
     * line with a soft corner, and `colorBorderSecondary` drew a box.
     */
    list: {
      marginTop: 22,
      border: `1px solid ${token.colorSplit}`,
      borderRadius: 16,
      overflow: "hidden",
    },
    /**
     * One fact, ~62 tall. The rule belongs to the row above it, so the last
     * row has none and the frame's own edge closes the block.
     *
     * THE TYPE STAYED, THE AIR CAME OUT. Two passes got this wrong from
     * opposite ends: 13/16 at 14/18 was too big in a 480 dialog, 12/14 was
     * too small, and 13/15 at 18/20 in a 600 dialog made the whole thing
     * ~960 tall — *"ამ სიგრძე არ უნდა იყოს, შეამოკლე."* The size was never
     * the problem after the dialog widened; five rows of 78 was. 10/20 of
     * padding and 2 between the label and its value takes 80px out of the
     * block and leaves every word exactly as large as it was.
     */
    row: { padding: "10px 20px" },
    rowRuled: {
      padding: "10px 20px",
      borderBottom: `1px solid ${token.colorSplit}`,
    },
    rowLabel: { fontSize: 13, color: token.colorTextTertiary, display: "block" },
    rowValue: {
      fontSize: 15,
      fontWeight: 600,
      color: token.colorText,
      letterSpacing: "0.01em",
    },
    /** The card's name under its picture. Explicit rather than antd's level-4,
     *  which is 20 and a weight lighter than the reference's title. */
    cardName: { fontSize: 20, fontWeight: 700, color: token.colorTextHeading },
    /**
     * The copy glyph: the reference's grey outline, not antd's link blue.
     * Blue says "this is a link to somewhere"; this is an action on the row
     * it sits in, and grey is what the rest of the product gives those.
     */
    copyIcon: { color: token.colorTextTertiary, fontSize: 16 },
    /** The moment after. Green, and the only time this control has a colour. */
    copiedIcon: { color: token.colorSuccess, fontSize: 16 },
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
