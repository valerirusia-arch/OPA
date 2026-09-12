// src/features/Payments/ui/MakePaymentModal.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  form: { marginTop: 8 },
  /** The tabs carry their own bottom rule, so the field needs no margin. */
  tabsItem: { marginBottom: 0 },
  kind: { marginBottom: 12 },
  input: { width: "100%" },
  card: { marginTop: 8 },
  resultAmount: { fontSize: 20, fontWeight: 600 },
  reference: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The wireframe's grey strip above the buttons: the amount and the card,
     * stated once, in the last place the reader looks before paying.
     */
    note: {
      marginTop: 8,
      padding: token.paddingSM,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
    },
  }) satisfies Record<string, CSSProperties>;
