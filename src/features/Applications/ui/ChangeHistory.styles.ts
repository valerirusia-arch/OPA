// src/features/Applications/ui/ChangeHistory.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  empty: { fontSize: 13 },
  /** The rule between entries — the log's only furniture. */
  rule: { marginBlock: 12 },
  /** The one quiet line under each change: when, who, and why. */
  meta: { fontSize: 13, lineHeight: 1.5 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The amount that was replaced, struck through and quiet. */
    from: {
      fontSize: 15,
      color: token.colorTextTertiary,
      fontVariantNumeric: "tabular-nums",
    },
    /** The amount that stands — the headline of each entry. */
    to: {
      fontSize: 15,
      fontWeight: 600,
      color: token.colorText,
      fontVariantNumeric: "tabular-nums",
    },
    /** The arrow between them, at the quiet weight. */
    arrow: { color: token.colorTextTertiary, fontSize: 12 },
  }) satisfies Record<string, CSSProperties>;
