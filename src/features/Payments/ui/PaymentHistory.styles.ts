// src/features/Payments/ui/PaymentHistory.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  amount: { fontWeight: 500 },
  note: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A borrower's name here has nowhere to go — this is a transaction row
     * on the internal payments book, not a profile link — so it stays plain
     * text rather than the product's link teal. Plain still isn't antd's
     * own default body-text opacity (88% of ink): the name is the row's own
     * identifier, so it reads at full `colorTextBase`, the same call
     * `PopinLine` makes for a popped-in value.
     */
    identifier: { color: token.colorTextBase },
  }) satisfies Record<string, CSSProperties>;
