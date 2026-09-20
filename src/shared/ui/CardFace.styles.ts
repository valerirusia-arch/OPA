// src/shared/ui/CardFace.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

export const styles = {
  /** The two-column foot: holder left, expiry right. */
  foot: { marginTop: 12 },
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
    face: {
      aspectRatio: "1.586",
      minHeight: 180,
      boxSizing: "border-box",
      padding: token.paddingLG,
      /*
       * LESS ROUND — *"ზედმეტად მომრგვალებულია."*
       *
       * `borderRadiusLG` is 14, and on a 340px-wide card that is 4% of the
       * width: a soft-cornered tile rather than a card. A payment card's
       * corner (ID-1) is 3.18mm on an 85.6mm card — almost exactly 3.7% —
       * but the eye reads a rectangle of this size as a card at less than
       * that, because a real one is held rather than drawn flat. 10 is the
       * product's own `borderRadius`, so this takes no new number.
       */
      borderRadius: token.borderRadius,
      background: ground,
      /* NO RIM. The hairline was white at 10%, which on a card sitting on a
         white page draws a pale line around the whole object — *"რაღაცა
         სტროუკები აქვს გარედან, რაც არ მომწონს."* A dark card already has an
         edge: it is dark against white. */
      /* A card is an object with a thickness; the page's own elevation says so
         without a second frame. */
      boxShadow: brand.shadowCard,
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
    plateFace: {
      aspectRatio: "1.586",
      boxSizing: "border-box",
      padding: 12,
      /* The same corner as the page's card — see `face`. */
      borderRadius: token.borderRadius,
      background: ground,
      boxShadow: brand.shadowCard,
    },
    /**
     * THE CARD'S NAME along the foot of the front — the biggest thing printed
     * on that face, because on that face it is the only thing that says what
     * the object is.
     *
     * It has the width to itself: the holder and the state share the line
     * BELOW it, so it never has to be traded against a pill.
     *
     * 14, MEASURED OFF THE DESIGNER'S OWN CROP — *"ტექსტს ამხელაზე რატომ
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
    plate: { fontSize: 14, fontWeight: 600, color: ink, letterSpacing: "0.01em" },
    /**
     * Whose card it is, under the name, in the finish's quiet ink — the way a
     * real card prints the holder under the product's name. 11 by the same
     * measurement: 0.34 of the card's width here against their 0.273.
     */
    plateSub: { fontSize: 11, color: quiet, letterSpacing: "0.02em" },
    /** The state on a thumbnail: the same pill, at the size that face can
     *  carry. It is the only thing printed on the nameplate besides the mark
     *  — see the note at the call site. */
    platePill: { fontSize: 11, lineHeight: "18px", paddingInline: 8 },
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
export const getFrontStyles = (token: GlobalToken) =>
  ({
    /**
     * THE MARK ON A WHITE TILE, top left, at the face's own inset.
     *
     * It used to be the bare symbol with `filter: brightness(1.85)` on it — a
     * stand-in, and an honest one while the card ran into near-black and a
     * teal disc all but disappeared on it. The face is bright and blue now,
     * where a brightened teal disc on a light blue ground reads as neither.
     *
     * The tile is the reference's own answer and a better one than a filter:
     * the mark keeps its real colours, it reads on any part of any ground,
     * and it is what an issuer's badge on a real card actually looks like.
     * A knockout mark from OPA would still be welcome — `src/assets/brand/` —
     * but this no longer needs one to be right.
     */
    mark: {
      flex: "none",
      display: "flex",
      background: token.colorBgContainer,
      borderRadius: token.borderRadius,
      padding: 5,
      boxShadow: brand.shadowRest,
      alignSelf: "flex-start",
    },
    /** The same tile on the thumbnail, at the size that face can carry. */
    markSmall: {
      flex: "none",
      display: "flex",
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusSM,
      padding: 4,
      boxShadow: brand.shadowRest,
      alignSelf: "flex-start",
    },
  }) satisfies Record<string, CSSProperties>;
