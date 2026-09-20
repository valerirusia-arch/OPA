// src/flows/payments/PaymentsScreen.styles.ts

import type { CSSProperties } from "react";
import { contentRow } from "../../shared/ui/grid";

export const styles = {
  page: { paddingBlock: 40 },
  column: contentRow,
  /** 16, the same gap /loan puts under "Manage loan". It was 24, so the two
   *  pages sat their first card at different heights — the kind of difference
   *  nobody names and everybody feels moving between them. */
  title: { marginTop: 0, marginBottom: 0 },
  /** The heading and the page's one action on a line, the gap under the ROW
   *  rather than under the heading — 16, the same /loan puts under "Manage
   *  loan", so the two pages sit their first card at the same height. */
  titleRow: { marginBottom: 16 },
} satisfies Record<string, CSSProperties>;
