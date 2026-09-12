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
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
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
      zIndex: 9999,
      padding: "8px 12px",
      borderRadius: 999,
      background: token.colorBgElevated,
      border: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: token.boxShadow,
    },
    /** Square, quiet, and the same size as the DevBar's own buttons. */
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
