// src/features/Applications/ui/UnderwritingActions.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  form: { marginTop: 12 },
  /**
   * The amount panel, as a ghost Collapse.
   *
   * The negative inline margin takes antd's own 12px header padding back out,
   * so "Change amount" starts on the same left edge as the section titles
   * above it rather than one indent in from them.
   */
  panel: { marginInline: -12 },
  field: { marginBottom: 12 },
  label: { fontSize: 13 },
  autoLine: { display: "block", marginBottom: 12 },
  history: { marginTop: 12 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The recalculated terms, under the figure they follow from — quiet,
     *  because it is a consequence and not something to fill in. */
    terms: {
      display: "block",
      marginTop: 8,
      marginBottom: 20,
      fontSize: 13,
      color: token.colorTextTertiary,
    },
    blockTitle: { fontWeight: 500, color: token.colorText },
  }) satisfies Record<string, CSSProperties>;
