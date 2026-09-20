// src/stories/ApplicationJourney.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  page: { padding: 24 },
  intro: { maxWidth: 760, marginBottom: 8 },
  /** The phases run down the page: one application, in the order it happens. */
  phases: { width: "100%" },
  stepBody: { minWidth: 0 },
  stepTitle: { display: "block", fontWeight: 500 },
  quote: { display: "block", fontSize: 13, fontStyle: "italic" },
  where: { fontSize: 13 },
  openLink: { paddingInline: 0, height: "auto" },
  toolTitle: { display: "block", fontWeight: 500 },
  toolEffect: { display: "block", fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A phase's heading row — the band the steps under it belong to.
     * The number is a disc so the eye can count the phases without reading.
     */
    phaseNo: {
      width: 26,
      height: 26,
      flex: "none",
      borderRadius: "50%",
      background: token.colorPrimary,
      color: token.colorWhite,
      fontSize: 13,
      fontWeight: 500,
    },
    /** One step: a recess, not a card — these sit inside a card already. */
    step: {
      width: "100%",
      boxSizing: "border-box",
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
    },
    /** A branch off the happy path — the same recess with a marked edge, so a
     *  detour reads as a detour rather than as the next step. */
    branch: {
      width: "100%",
      boxSizing: "border-box",
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
      borderInlineStart: `3px solid ${token.colorWarning}`,
    },
    quote: { color: token.colorTextTertiary },
    where: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
