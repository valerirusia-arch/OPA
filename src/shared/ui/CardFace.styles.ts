// src/shared/ui/CardFace.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

export const styles = {
  /** The two-column foot: holder left, expiry right. */
  foot: { marginTop: 12 },
} satisfies Record<string, CSSProperties>;

/**
 * The three finishes, named after WHOSE card they are — the colour is the part
 * that changes, the ownership is not. `opa` is the brand teal OPA issues on,
 * `borrower` the warm graphite of the card the borrower brought, `light` the
 * pale blue the pair was first drawn in and which nothing uses.
 */
export type CardTone = "light" | "opa" | "borrower";

/**
 * THE ORANGE BAND ALONG THE FOOT OF OPA'S CARD.
 *
 * The brand runs on two colours and the card was wearing one of them. A band
 * of the CTA orange at the foot puts both on the one object that should read
 * as OPA on sight, the way the brand does everywhere else: teal holds the
 * field, orange takes the smaller share.
 *
 * STILL TWO FLAT FILLS. The `linear-gradient` has both stops at the same
 * position, so nothing blends — it is a hard edge between two solid colours,
 * drawn without a second element. The ban on gradients is a ban on a card
 * pretending to catch light, and this does not.
 *
 * IT IS A PIXEL HEIGHT, NOT A PERCENTAGE, and that is the whole reason it
 * works. At 72% the seam cut straight through the masked number: the face is
 * an aspect ratio, so it is a different height in the loan page's column and
 * in the 520px dialog, and a percentage put the edge in a different place on
 * each of them. A fixed band sits the same distance off the bottom wherever
 * the card is drawn, and the face pads itself clear of it, so nothing ever
 * straddles the seam.
 */
const OPA_BAND = 40;

export const getStyles = (token: GlobalToken, tone: CardTone = "light") => {
  /* Both of the product's real finishes are dark enough to invert, so one
     flag covers the ink and a second picks the material. */
  const inverted = tone !== "light";
  const ground =
    tone === "borrower"
      ? brand.cardBorrower
      : tone === "opa"
        ? `linear-gradient(to top, ${brand.orange} 0 ${OPA_BAND}px, ${brand.cardOpa} ${OPA_BAND}px)`
        : brand.cardLight;
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
      /* Clear of the band, keeping the face's own inset between the last line
         and the orange — so the band stays empty, as it was drawn. */
      ...(tone === "opa" ? { paddingBottom: token.paddingLG + OPA_BAND } : null),
      borderRadius: token.borderRadiusLG,
      background: ground,
      border: `1px solid ${inverted ? brand.cardDarkEdge : brand.cardLightEdge}`,
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
