// src/features/Applications/ui/UnderwritingActions.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  form: { marginTop: 12 },
  field: { marginBottom: 12 },
  /** Two controls sharing a row, and each half of the amount pair. */
  half: { flex: 1, minWidth: 140 },
  label: { fontSize: 13 },
  currentValue: { fontSize: 16, fontWeight: 500, paddingTop: 4 },
  autoLine: { display: "block", marginBottom: 12 },
  overrideButton: { marginTop: 0 },
  history: { marginTop: 12 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * Each action in its own framed block, per the wireframe.
     *
     * Five controls stacked with nothing between them read as one long form,
     * and these are five separate decisions — one of them irreversible. The
     * frame is what says "this is a thing on its own".
     */
    block: {
      padding: token.padding,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorderSecondary}`,
    },
    blockTitle: { fontWeight: 500, color: token.colorText },
    /** The amount panel is a Collapse, so it brings its own border. */
    panel: { background: token.colorBgContainer },
  }) satisfies Record<string, CSSProperties>;
