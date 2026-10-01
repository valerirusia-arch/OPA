// src/features/Applications/ui/CreditScoreGauge.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** The FICO range the gauge spans, and the band edges on it. */
export const SCORE_MIN = 300;
export const SCORE_MAX = 850;
export const BAND_LOW = 580; // below → poor (red)
export const BAND_HIGH = 670; // at/above → good (green); between → fair (amber)

/** Where a value sits along the track, 0–100, clamped. */
export const scorePct = (value: number) =>
  Math.max(0, Math.min(100, ((value - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100));

export const styles = {
  /** The score sits in its own light panel — the one result on this card that
   *  is a judgement, not a pass or a fail. */
  micro: {
    fontSize: 11,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  /** The big figure. Coloured by band, so a glance reads good / fair / poor. */
  score: { fontSize: 40, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  band: { fontSize: 14, fontWeight: 600 },
  ends: { fontSize: 11, fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) => {
  const red = token.colorError;
  const amber = token.colorWarning;
  const green = token.colorSuccess;
  const redEnd = scorePct(BAND_LOW);
  const amberEnd = scorePct(BAND_HIGH);
  return ({
    panel: {
      background: token.colorFillQuaternary,
      borderRadius: token.borderRadiusLG,
      padding: 20,
    },
    provider: { fontSize: 13, color: token.colorTextTertiary, textAlign: "end" },
    /** The track: three crisp colour zones, poor → fair → good. */
    track: {
      position: "relative",
      height: 10,
      borderRadius: 5,
      marginTop: 16,
      background: `linear-gradient(90deg, ${red} 0 ${redEnd}%, ${amber} ${redEnd}% ${amberEnd}%, ${green} ${amberEnd}% 100%)`,
    },
    /**
     * "YOU ARE HERE" — A NOTCH IN THE BAND, BRACKETED.
     *
     * The mark that read best but cost the least height: the band is cut by a
     * thin gap at the score and the two edges curve toward it, `)（`, like a
     * caliper on the spot — *"დაახლოებით ესეთი რამ, უფრო დახვეწილი."* The number
     * already lives large above the band, so the mark only says WHERE.
     *
     * Drawn as an SVG so the curves are true arcs and the overhang is clean;
     * the gap is painted in the panel's own colour and the brackets in the
     * band's, both set inline in the component. Centred on the band, it costs a
     * couple of px of overhang and no vertical block.
     */
    markerWrap: {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      lineHeight: 0,
    },
    endsQuiet: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
};
