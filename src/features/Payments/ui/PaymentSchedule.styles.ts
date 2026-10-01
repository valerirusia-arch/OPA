// src/features/Payments/ui/PaymentSchedule.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /** The figure is what the row is about, so it carries the weight. */
  amount: { fontWeight: 500, fontVariantNumeric: "tabular-nums" },
  /** The row's pay link, a touch heavier so it reads as the row's action with
   *  the same presence the balance card's "Make a payment" link has. */
  payNow: { fontWeight: 500 },
} satisfies Record<string, CSSProperties>;
