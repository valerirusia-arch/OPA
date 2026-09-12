// src/features/Payments/ui/RepaymentCardPanel.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  rule: { marginBlock: 12 },
  /**
   * Grows inside its Col and lays its head and body out as a flex column, so
   * the body takes the remainder instead of the whole card being squeezed to
   * the row's height. See PaymentsOverview.styles for why a percentage height
   * on a Card does not work.
   */
  card: { flex: 1, display: "flex", flexDirection: "column" },
  fillBody: { flex: 1 },
  /** In the head: no left padding, so it aligns with the head's own edge. */
  headAction: { paddingInlineEnd: 0 },
  /** antd's modal body starts under the title; the form gets its own air. */
  dialog: { marginTop: 16 },
  /** A footnote about who can see what, not a warning. */
  privacy: { fontSize: 13, marginTop: 12 },
} satisfies Record<string, CSSProperties>;
