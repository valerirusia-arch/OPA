// src/features/Payments/ui/PaymentSchedule.styles.ts

import type { CSSProperties } from "react";
import { brand } from "../../../theme/tokens";

export const styles = {
  /** The figure is what the row is about, so it carries the weight. */
  amount: { fontWeight: 500, fontVariantNumeric: "tabular-nums" },
} satisfies Record<string, CSSProperties>;

export const getStyles = () =>
  ({
    /**
     * The next line owed.
     *
     * It was `colorPrimaryBg`, the blue antd derives from the primary — and it
     * stayed blue after the tables went warm, so the one row that matters was
     * the only cold thing left on the page: *"ეს არ მომწონს, ლურჯი რომ არის —
     * არ უნდა იყოს ლურჯი, აქ ხომ შევცვალეთ."*
     *
     * `warmTint` is the tables' own marked tone and, not by accident, EXACTLY
     * the lightness the blue had — it was derived from it. So the row is as
     * easy to find in twelve as it was, and no darker against its own text.
     */
    nextRow: { background: brand.warmTint },
  }) satisfies Record<string, CSSProperties>;
