// src/features/Payments/ui/PaymentSchedule.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The figure is what the row is about, so it carries the weight. */
  amount: { fontWeight: 500, fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The next line owed.
     *
     * `colorPrimaryBg` is the palest tint antd derives from the primary — the
     * same one behind a selected menu item and inside the illustration
     * grounds. Strong enough to find at a glance in twelve rows, light enough
     * that the row's own text keeps its contrast.
     */
    nextRow: { background: token.colorPrimaryBg },
  }) satisfies Record<string, CSSProperties>;
