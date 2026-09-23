// src/features/Applications/ui/CreditScoreGauge.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../../theme/tokens";

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
     * "YOU ARE HERE" — THE SLIDER'S OWN HANDLE.
     *
     * It was a 4px white bar ringed in near-black, and against a product with
     * no hard outlines anywhere it read as borrowed from somewhere else:
     * *"ეს თითქოს სტილიდან ამოვარდნილია."*
     *
     * The product already HAS a control for a position on a track — the
     * amount sliders — so this is that handle: a white disc with a 2px ring in
     * the soft teal, measured off `.ant-slider-handle` rather than guessed.
     * One idiom for one idea.
     *
     * 16 rather than the slider's 12, because it sits on a 10px band instead
     * of a 4px rail and has to stand proud of it by the same margin. The drop
     * shadow is what lifts it off whichever zone it lands on — red, amber or
     * green — where a single flat ring reads differently against each.
     */
    marker: {
      position: "absolute",
      top: "50%",
      width: 16,
      height: 16,
      marginLeft: -8,
      marginTop: -8,
      borderRadius: "50%",
      background: token.colorBgContainer,
      boxShadow: `0 0 0 2px ${brand.primarySoft}, 0 1px 4px rgba(38, 36, 35, 0.22)`,
    },
    endsQuiet: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
};
