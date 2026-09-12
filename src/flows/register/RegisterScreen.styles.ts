// src/flows/register/RegisterScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { contentRow } from "../../shared/ui/grid";

export const logoMark: CSSProperties = { width: 28, height: 28, borderRadius: "50%" };
export const brandTitle: CSSProperties = { margin: 0 };
export const page: CSSProperties = { minHeight: "100vh" };
/**
 * The step rail, at the top of the card and the full width of it.
 *
 * It used to live in the header capped at 260px, where it was one more thing
 * on a bar it did not belong to. Over the card it measures, at that card's own
 * width, it reads as the card's head — which is how the loan application
 * wizard draws the same thing.
 */
export const stepsBar: CSSProperties = {
  width: "100%",
  marginTop: 8,
  marginBottom: 0,
  lineHeight: 1,
};
export const footer: CSSProperties = { marginTop: 24 };

export const getStyles = (token: GlobalToken) =>
  ({
    logoPlaceholder: { ...logoMark, background: token.colorFillSecondary },
    /** One bar, not two: logo, progress and language on a single rule. */
    header: {
      display: "flex",
      alignItems: "center",
      height: 72,
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    headerInner: {
      ...contentRow,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: token.paddingLG,
    },
    body: { padding: token.paddingLG },
    /** The card's own head: how far along, above the step's own heading. */
    progress: { marginBottom: 24 },
    /** Tabular figures so the count does not jiggle as it climbs. */
    stepCount: {
      fontSize: 12,
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
    },
    card: { width: "100%", maxWidth: 760 },
    /**
     * Steps 2-6 are short; they keep the card width, centre inside it, and
     * reserve one height so the wizard never resizes as you move through it.
     */
    narrowInner: {
      width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      minHeight: 380,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  }) satisfies Record<string, CSSProperties>;
