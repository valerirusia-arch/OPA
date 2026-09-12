// src/features/Loan/ui/LoanAdminPanel.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  list: { marginTop: 12 },
  rule: { marginBlock: 0 },
  comment: { paddingBlock: 12 },
  meta: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The same heading weight the review step's sections use. */
    sectionTitle: { fontWeight: 500, color: token.colorText },
  }) satisfies Record<string, CSSProperties>;
