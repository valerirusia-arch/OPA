// src/flows/_devbar/StageDock.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  tag: { margin: 0 },
  /**
   * A fixed width for the readout.
   *
   * The labels run from "Declined" to "Submitted · under review", and a dock
   * that resizes with them moves its own arrows out from under the cursor
   * between presses — which is exactly the gesture this control exists for.
   */
  readout: { width: 168 },
  /** Narrow screens: the readout takes whatever room the pill has instead of
   *  a fixed 168, so the dock stays inside the viewport. */
  readoutCompact: { flex: 1, minWidth: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken, compact = false) =>
  ({
    /**
     * Floating, bottom right, over everything.
     *
     * Bottom right because the product's own actions live bottom left (the
     * wizard's Back) and top right (the header), and because a control that
     * is not part of the product should not sit in one of the product's own
     * corners. `zIndex` matches the DevBar's: they are the same tool.
     */
    dock: {
      position: "fixed",
      right: 16,
      bottom: 16,
      /* On a phone it spans the width between the gutters, so it can never
         run off the right edge. */
      ...(compact ? { left: 16 } : null),
      zIndex: 9999,
      padding: "8px 12px",
      borderRadius: 999,
      background: token.colorBgElevated,
      border: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: token.boxShadow,
    },
    /** Square, quiet, and the same size as the DevBar's own buttons. */
    arrow: { width: 28, height: 28, color: token.colorTextSecondary },
    /** Between the stage walker and the tracker switch: they are two
     *  different controls sharing one pill, and without a rule the second
     *  one reads as part of the first. */
    split: {
      width: 1,
      alignSelf: "stretch",
      marginInline: 2,
      background: token.colorSplit,
    },
    counter: {
      fontSize: 10,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: token.colorTextTertiary,
      lineHeight: 1.4,
    },
    label: { fontSize: 13, fontWeight: 500, color: token.colorText, lineHeight: 1.3 },
  }) satisfies Record<string, CSSProperties>;
