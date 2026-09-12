// src/features/LoanApplication/ui/LoanDetailsStep.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  amountLabel: { display: "block" },
  amountTerms: { display: "block" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The answer to the whole step, so it is the largest thing on it. Recessed
     * rather than outlined: it is a result the form produced, not another
     * field to fill in.
     */
    amount: {
      marginBottom: 24,
      padding: token.paddingLG,
      borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
      textAlign: "center",
    },
    amountValue: { marginTop: 4, marginBottom: 4, lineHeight: 1.2 },
    amountEmpty: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
