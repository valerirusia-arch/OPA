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
     * The next line owed — MARKED IN THE MARGIN, NOT WASHED IN COLOUR.
     *
     * It was a full-row tint from `colorPrimaryBg`. Across a row that runs the
     * width of the card that is a lot of colour to say "this one", and it made
     * the table's quietest row its loudest object: *"ამხელაზე გალურჯება არ
     * არის საჭირო, რამე ესეთი სტოუკივით რომ ჩავუსვათ თებლებში მარცხნიდან."*
     *
     * So a 3px stroke down the left edge instead. It is `inset` box-shadow
     * rather than `borderLeft` on purpose: a real border would push every cell
     * in the marked row 3px right of the rows above and below it, and a
     * marker that moves the thing it marks is worse than no marker.
     */
    nextRow: { boxShadow: `inset 3px 0 0 ${token.colorPrimary}` },
  }) satisfies Record<string, CSSProperties>;
