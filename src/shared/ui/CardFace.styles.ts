// src/shared/ui/CardFace.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

export const styles = {
  /** The two-column foot: holder left, expiry right. */
  foot: { marginTop: 12 },
  /** The card's name and the line under it, spaced by a fraction of the card
   *  so the block holds together at any width. */
  plateBlock: { gap: "1.4cqw" },
} satisfies Record<string, CSSProperties>;

/**
 * ONE FINISH, BECAUSE ONE CARD IS DRAWN AS A CARD.
 *
 * There were three: OPA's, a warm graphite for the card the borrower brought,
 * and a pale blue nothing ever used. The graphite went dead when managing the
 * repayment card moved to the profile and became a ROW there — the wizard's
 * own treatment — so its whole chain (SavedCardFace, RepaymentCardPanel) was
 * rendered nowhere but Storybook, which showed a reviewer something the
 * product does not contain. The pale one had said "drawn, not in use" from the
 * day it was written.
 *
 * What is left is the card OPA issues, which is the only object in this
 * product that is a card.
 */
export type CardTone = "opa";


export const getStyles = (token: GlobalToken) => {
  /* The face is dark, so it takes white ink and prints its own status pill. */
  const inverted = true;
  const ground = brand.cardSkin;
  const ink = inverted ? brand.cardDarkInk : token.colorText;
  const quiet = inverted ? brand.cardDarkQuiet : token.colorTextTertiary;
  return ({
    /**
     * A CARD, not a recessed panel.
     *
     * It was `colorFillQuaternary` — the same grey as a filled input — then a
     * wash, and now the two finishes from the designer's references. The
     * hairline is the one piece of framing kept: a white card on a white card
     * body has no edge otherwise, and the dark one needs the same line to
     * catch the light along its top.
     *
     * A MINIMUM HEIGHT, because a card has proportions. It had none while the
     * chip held the middle of the face open; with the chip gone the label sat
     * straight on top of the number and the shape stopped reading as a card —
     * *"ბარათები არ დააპატარავო სიგრძეში."*
     *
     * AND IT IS AN ASPECT RATIO, not a pixel count. A fixed 200 is right in
     * the page's one-third column and flat in the 520px dialog, where the
     * same card is 130px wider — the designer saw both. 1.586:1 is the real
     * proportion of a payment card (ID-1), so the face is that shape wherever
     * it is drawn, and `minHeight` is only the floor for a very narrow phone.
     */
    /**
     * THE CARD, AND THE CONTAINER EVERYTHING ON IT IS MEASURED AGAINST.
     *
     * *"ზომები ყველაფერი უნდა იყოს ბარათის შესაბამისი."* This face is drawn
     * at three widths — 160 in the details dialog, ~285 in /loan's column,
     * ~660 when that column goes full width on a narrow window — and until
     * now every measurement on it was a fixed pixel count chosen for the
     * middle one. At 660 the mark was a speck in a corner and the name was
     * small print; at 160 the same numbers were too big to fit.
     *
     * `container-type: inline-size` makes the face a query container, so
     * everything inside can be stated in `cqw` — a percentage of the card's
     * own width — and the card is one drawing at any size. The fractions
     * come from the 285 card the designer approved: 8.4% padding, 14% for
     * the mark, 6% for the name.
     *
     * THE PADDING IS ON THE CHILD, NOT HERE. An element cannot query itself:
     * `cqw` inside a container resolves against the nearest ANCESTOR
     * container, so a padding in `cqw` on this box would be measuring the
     * card outside it. `faceInner` carries it instead.
     *
     * NO `minHeight`. It was 180, which is exactly what the 285 card
     * computes to, so it did nothing there and squashed the 160 one into a
     * square. The aspect ratio is the height.
     */
    face: {
      aspectRatio: "1.586",
      containerType: "inline-size",
      boxSizing: "border-box",
      borderRadius: token.borderRadius,
      background: ground,
      /* A card is an object with a thickness; the page's own elevation says
         so without a second frame. */
      boxShadow: brand.shadowCard,
    },
    /** The card's contents, inset by a fraction of the card's own width. */
    faceInner: {
      height: "100%",
      boxSizing: "border-box",
      padding: "8.4cqw",
    },
    /**
     * The status pill, printed on the card rather than stuck to it — see the
     * note at the call site. Translucent white over the card's own material,
     * which is what a real card's printing is — and it works on graphite and
     * navy alike, because both are dark.
     */
    cutPill: {
      background: brand.cardDarkPill,
      color: brand.cardDarkInk,
      borderColor: "transparent",
    },
    /** The issuer line takes the finish's ink. */
    label: { color: quiet },
    /**
     * The ownership eyebrow at the very top of the face — "ISSUED BY OPA" on
     * the card OPA issues, "YOUR CARD" on the one the borrower brought. It is
     * the one line that says WHOSE card this is in words, so the two faces are
     * told apart by more than their finish. Uppercase and tracked like the
     * product's micro-labels, in the finish's quiet ink so it sits behind the
     * number rather than competing with it.
     */
    owner: {
      display: "block",
      fontSize: 11,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontWeight: 600,
      color: quiet,
    },
    /**
     * The number across the middle.
     *
     * 18 rather than 20, and the tracking halved: at `•••• 4417` the string is
     * a quarter as long as the full mask, so it no longer needs the size to
     * hold the middle of the card, and the wide tracking that kept sixteen
     * dots readable only spread nine characters out.
     */
    number: {
      fontSize: 18,
      letterSpacing: "0.02em",
      color: ink,
      fontVariantNumeric: "tabular-nums",
    },
    /**
     * THE NAMEPLATE'S OWN FACE — a THUMBNAIL, not a card at reading size.
     *
     * The details dialog draws the card small, above a title and a list, the
     * way the designer's reference does. At that size the page's card metrics
     * are wrong twice over: `paddingLG` is a fifth of the face's width, and
     * `minHeight: 180` fights the aspect ratio and makes a 240-wide card 180
     * tall — a square, not a card.
     */
    /**
     * THE CARD'S NAME along the foot of the front — the biggest thing printed
     * on that face, because on that face it is the only thing that says what
     * the object is.
     *
     * It has the width to itself: the holder and the state share the line
     * BELOW it, so it never has to be traded against a pill.
     *
     * 5% of the card's width — 14px on the 285 card /loan draws.
     *
     * FOUR PASSES, AND THE LAST ONE SETTLED IT WITH A PICTURE. 22 read as a
     * headline; 14 was called too small; 17 and then 16 were still over. The
     * designer then sent the card at the size they wanted it and asked for
     * that and nothing else — *"ტექსტების და ლოგოს ზომა ესე დააბრუნე, მხოლოდ
     * ეგ."* Measured off it, the name runs 0.437 of the card's width, which
     * is 5cqw — and the same 0.438 the earlier reference gave. So 14 was
     * right the first time; what was wrong was reading it back as "too
     * small" from a crop at a different scale. — *"ტექსტს ამხელაზე რატომ
     * წერ?"* Compared as a fraction of the card's width, so the two crops'
     * different scales cancel: the name ran 0.55 of the card's width here
     * against 0.438 in theirs. On a real card the product's name is small
     * print beside the number; here there is no number, and it still should
     * not be the headline.
     *
     * (The DOM is no help for this: the text sits in a `Flex vertical`, so
     * its span stretches to the card's inner width whatever the font size,
     * and every ratio read off `getBoundingClientRect` comes back the same.)
     */
    plate: {
      fontSize: "5cqw",
      lineHeight: 1.25,
      fontWeight: 600,
      color: ink,
      letterSpacing: "0.01em",
    },
    /**
     * Whose card it is, under the name, in the finish's quiet ink — the way a
     * real card prints the holder under the product's name. 3.8%, measured
     * off the same picture: 0.293 of the card's width against the name's
     * 0.437.
     */
    plateSub: { fontSize: "3.8cqw", lineHeight: 1.3, color: quiet, letterSpacing: "0.02em" },
    /** The state on a thumbnail: the same pill, at the size that face can
     *  carry. It is the only thing printed on the nameplate besides the mark
     *  — see the note at the call site. */
    /** The state pill, in the same card-relative units as everything else. */
    platePill: {
      fontSize: "3.5cqw",
      lineHeight: 1.8,
      paddingInline: "3cqw",
      height: "auto",
    },
    /** The foot's labels and values, in the finish's own ink. */
    footLabel: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: quiet,
    },
    footValue: {
      fontSize: 15,
      fontWeight: 500,
      color: ink,
      fontVariantNumeric: "tabular-nums",
    },
    /** The expiry, as a footnote to the number rather than a corner block. */
    meta: {
      fontSize: 13,
      color: inverted ? quiet : token.colorTextDescription,
      fontVariantNumeric: "tabular-nums",
    },
  }) satisfies Record<string, CSSProperties>;
};

/**
 * THE FRONT OF OPA'S OWN CARD — the mark, the state, the masked number.
 *
 * It started blank, on the reading that a front printed with card details was
 * OPA claiming to hold what the WBS says it does not. That reading was too
 * wide: the last four and whether the card has been spent ARE OPA's, and the
 * designer put both back on the face — the mark top left, the state top right,
 * the number along the foot: *"ეს მარჯვნივ კუთხეში მაღლა ჩაუსვი და ქვემოთ
 * ანგარიშის ნომერი."*
 *
 * What stays off it is what OPA genuinely does not hold. The full number, the
 * expiry and the security code "are NOT stored, processed or transmitted by
 * OPA application and are accessible only via a secure embedded view", so they
 * appear on the revealed face and nowhere else.
 */
export const getMarkStyles = () => {
  /**
   * THE MARK'S TILE — the state pill's material, not a white box.
   *
   * It has been three things: a white square, then nothing with a glow, then
   * this, then white again, and now this for good. The designer settled it by
   * naming which white they meant: *"მინდა რომ ეს თეთრი ფერი იჯდეს შუაში, აი
   * ამ ცეცხლის შუაში, მაგრამ გარედან ეს თეთრი ბექგრაუნდი ჰქონდეს, როგორც
   * 'Not used'-ს აქვს."* The white belongs to the FLAME, which is the mark's
   * own drawing; the box around it belongs to the card.
   *
   * `cardDarkPill` is the translucent dark the state pill is cut from, so the
   * two things printed on this face are made of one material and the mark
   * sits ON the card rather than in a sticker stuck to it. It was rejected
   * once, on the argument that a teal disc inside a dark tile on the dark half
   * of the ramp is three near-values stacked — true of the DISC, and beside
   * the point: what reads at this size is the white flame inside it, and a
   * flame is brighter against dark than against white.
   *
   * Sized in `cqw` like everything else on the face — 12% of the card's own
   * width, a 34px tile on the 285 card /loan draws. It was 17% and then 14%,
   * and both were a tile the eye reached before the card's own name:
   * *"ლოგოც დიდია."* 12 is what the designer's own picture measures, where
   * the mark takes 11.7% of the card and carries no tile at all.
   */
  const tile: CSSProperties = {
    flex: "none",
    alignSelf: "flex-start",
    boxSizing: "border-box",
    width: "12cqw",
    height: "12cqw",
    padding: "1.6cqw",
    borderRadius: "3cqw",
    background: brand.cardDarkPill,
    display: "flex",
  };
  return {
    mark: tile,
    /** The same tile; the thumbnail differs only in the card's width. */
    markSmall: tile,
    /** The mark fills its tile — see the note on `style` in Logo. */
    markGlyph: { width: "100%", height: "100%" } satisfies CSSProperties,
  } satisfies Record<string, CSSProperties>;
};
