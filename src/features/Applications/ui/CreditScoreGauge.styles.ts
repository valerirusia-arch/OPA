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
    /** The "you are here" needle — a white bar with a knob, over the zones. */
    marker: {
      position: "absolute",
      top: -4,
      bottom: -4,
      width: 4,
      marginLeft: -2,
      borderRadius: 2,
      background: token.colorBgContainer,
      boxShadow: `0 0 0 1.5px ${token.colorText}`,
    },
    endsQuiet: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
};
