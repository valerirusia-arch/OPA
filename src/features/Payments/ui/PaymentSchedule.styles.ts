// src/features/Payments/ui/PaymentSchedule.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The figure is what the row is about, so it carries the weight. */
  amount: { fontWeight: 500, fontVariantNumeric: "tabular-nums" },
  /** The row's pay link, a touch heavier so it reads as the row's action with
   *  the same presence the balance card's "Make a payment" link has.
   *  `nowrap`: two words breaking onto their own lines ("Pay" / "now") is
   *  not a smaller version of the link, it's a different, broken-looking
   *  thing — see the note on the actions column in PaymentSchedule.tsx. */
  payNow: { fontWeight: 500, whiteSpace: "nowrap" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A borrower's name on the internal schedule has nowhere to go — same
     * call as Payment History's own identifier style — so it stays plain
     * text rather than the product's link teal, but reads at full
     * `colorTextBase` rather than antd's dimmer default body text.
     */
    identifier: { color: token.colorTextBase },
  }) satisfies Record<string, CSSProperties>;
