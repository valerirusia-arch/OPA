// src/features/Loan/ui/VirtualCardModal.styles.ts
//
// MEASURED OFF THE REFERENCE, 2026-09-21 — *"ნახე რა პატარა ვიუში ზის, მინდა
// ამას მივბაძოთ და ზუსტად მსგავსად გავაკეთოთ."*
//
// The designer sent a full-window capture, so this is arithmetic rather than
// taste. Taking the browser viewport as 1728 and the image as 2000, the scale
// is 1.157, and the reference comes out as:
//
//   modal          716 img → 619    card         180 img → 156
//   side inset      44 img →  38    row height    88 img →  76
//   label           18 img →  15    value         21 img →  18
//   card → title    23 img →  20    title → list  54 img →  47
//
// So: 620 wide, a 160 card, 36 of inset, rows of 76, and the type a step up
// from where the last pass left it. The card is a QUARTER of the dialog —
// *"ბარათი უფრო პატარაა მაინც."*
//
// THE HOLDER CAME OFF THE CARD to get there. At 240 the face was printing a
// name and a state along its foot and could not go below 200 without the
// name breaking in two. The reference's card prints neither: a logo in one
// corner, a network mark in the other. Ours does the same — the mark and the
// state — and the holder is the second row of the list, 100px below.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * The body's own inset, and what the list is measured against.
 *
 * 24, down from the reference's measured 38 — *"სივრცე გამოიყენე მარცხნივ და
 * მარჯვნივ უფრო, ზედმეტად შემოწეულია შიგნით."* The reference can afford 38
 * because its rows hold two short Georgian words; ours hold "4111 2233 4455
 * 3094" with a copy control hanging off the right edge, and at 38 the row had
 * 548 of usable width with the number and the glyph pushed together in the
 * middle of it. 24 gives the list 572 and the page reads wider without the
 * dialog growing.
 */
const INSET = 24;

export const styles = {
  /** antd's default body padding is meant for a form; this is a record. */
  body: { padding: INSET },
  /** A QUARTER OF THE DIALOG, the reference's own proportion. It can be this
   *  small now that nothing but the mark and the state is printed on it. */
  face: { width: 160, maxWidth: "100%" },
  /** Air above the card. The reference opens with a clear band before its
   *  first object — measured at ~104 from the modal's top, of which the body
   *  inset is 36. */
  head: { marginTop: 16 },
  /** The card's own name, centred under it. */
  title: { marginTop: 18, marginBottom: 0, textAlign: "center" },
  /** The padlock and the sentence. `flex-start` in case the sentence wraps —
   *  an icon centred against two lines sits between them. */
  issuer: { marginTop: 20 },
  /** Nudges the padlock onto the first line's own optical centre. */
  issuerIconBox: { marginTop: 3 },
  issuerText: { fontSize: 12 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The padlock beside USIO's name: a mark, not a warning. */
    issuerIcon: { color: token.colorTextTertiary, flex: "none" },
    /**
     * THE LIST, AS ONE BORDERED BLOCK — the reference's arrangement.
     *
     * Five facts laid loose on a dialog read as five paragraphs; inside one
     * rounded frame with hairlines between them they read as the record of
     * one object, which is what they are.
     *
     * ONE TONE DOWN FROM INVISIBLE. It was `colorSplit`, the product's
     * lightest rule, and against white at this size it disappeared —
     * *"ესენი სტროუკები ოდნავ ფერმკრთალია და არ ჩანს, სულ მცირე ტონით
     * გაამუქე, აი ძაან ცოტა."* `colorBorderSecondary` is the next step up and
     * the only one between here and a drawn box.
     */
    list: {
      marginTop: 36,
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 16,
      overflow: "hidden",
    },
    /**
     * One fact, ~64 tall. The rule belongs to the row above it, so the last
     * row has none and the frame's edge closes the block.
     *
     * TIGHTER THAN THE FIRST READ OF THE REFERENCE, on a closer look at it —
     * *"ტექსტები უფრო პატარაა, სფეისინგები უფრო პატარაა მაღლიდან და
     * ქვემოდან, ტექსტები ოდნავ უფრო ახლო-ახლოსაა."* Measuring one row of the
     * reference rather than dividing the list by five: its padding is nearer
     * 12 than 14, and the gap between a label and the value under it is 2,
     * not 4 — they read as one pair, which is what makes a row a fact rather
     * than two lines of text.
     */
    row: { padding: "12px 20px" },
    rowRuled: {
      padding: "12px 20px",
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    rowLabel: { fontSize: 13, color: token.colorTextTertiary, display: "block" },
    rowValue: {
      fontSize: 15,
      fontWeight: 600,
      color: token.colorText,
      letterSpacing: "0.01em",
    },
    /** The card's name under its picture — the reference sets its title at
     *  about 21 and bold, which is a step over antd's level-4. */
    cardName: { fontSize: 20, fontWeight: 700, color: token.colorTextHeading },
    /**
     * The copy glyph: the reference's grey outline, not antd's link blue.
     * Blue says "this is a link to somewhere"; this is an action on the row
     * it sits in, and grey is what the rest of the product gives those.
     */
    copyIcon: { color: token.colorTextSecondary, fontSize: 18 },
    /** The moment after. Green, and the only time this control has a colour. */
    copiedIcon: { color: token.colorSuccess, fontSize: 18 },
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
