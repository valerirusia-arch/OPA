// src/shared/ui/CardFace.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

export const styles = {
  /** The two-column foot: holder left, expiry right. */
  foot: { marginTop: 12 },
} satisfies Record<string, CSSProperties>;

/**
 * The three finishes. `graphite` is the flat slab OPA issues, `dark` the navy
 * gradient the borrower brought, `light` the pale blue the pair was first
 * drawn in and which nothing uses.
 */
export type CardTone = "light" | "dark" | "graphite";

export const getStyles = (token: GlobalToken, tone: CardTone = "light") => {
  /* Both of the product's real finishes are dark enough to invert, so one
     flag covers the ink and a second picks the material. */
  const inverted = tone !== "light";
  const ground =
    tone === "graphite"
      ? brand.cardGraphite
      : tone === "dark"
        ? brand.cardDark
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
