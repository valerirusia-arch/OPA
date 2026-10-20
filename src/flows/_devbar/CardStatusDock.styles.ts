// src/flows/_devbar/CardStatusDock.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  tag: { margin: 0 },
  /** Fixed width so the arrows don't shift between "Not used" and "In use". */
  readout: { width: 96 },
} satisfies Record<string, CSSProperties>;

/** Height of the stage dock plus a gap — what the card dock clears on a phone. */
const STAGE_DOCK_CLEARANCE = 72;

export const getStyles = (token: GlobalToken, compact = false) =>
  ({
    /**
     * Floating, bottom LEFT — the stage dock owns bottom right, and these are
     * two separate preview controls. On the loan page bottom left is free (the
     * wizard's Back lives on the application pages, not here). `zIndex` matches
     * the DevBar's: they are the same tool.
     */
    dock: {
      position: "fixed",
      left: 16,
      /* Side by side the two docks collide below ~576px, so here this one
         drops ABOVE the stage dock instead of overlapping it. */
      bottom: compact ? 16 + STAGE_DOCK_CLEARANCE : 16,
      zIndex: 9999,
      padding: "8px 12px",
      borderRadius: 999,
      background: token.colorBgElevated,
      border: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: token.boxShadow,
    },
    arrow: { width: 28, height: 28, color: token.colorTextSecondary },
    counter: {
      fontSize: 10,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: token.colorTextTertiary,
      lineHeight: 1.4,
    },
    label: { fontSize: 13, fontWeight: 500, color: token.colorText, lineHeight: 1.3 },
  }) satisfies Record<string, CSSProperties>;
