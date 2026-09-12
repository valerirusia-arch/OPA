// src/features/Profile/ui/VerifiedLabel.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * No chip. A label is a label; a filled pill next to it competes with the
     * field for weight and makes a calm fact look like a badge to be earned.
     * The tick and the colour say "confirmed" on their own, one size down so
     * the field's name stays the first thing read.
     */
    verified: { color: token.colorSuccess, fontSize: token.fontSizeSM },
    unverified: { color: token.colorTextTertiary, fontSize: token.fontSizeSM },
  }) satisfies Record<string, CSSProperties>;
