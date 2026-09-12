// src/shared/ui/EmptyState.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/**
 * A full page of rows plus the header. An empty table that keeps this height
 * leaves the card the size it was a moment ago, instead of snapping shut and
 * dragging everything below it up the page.
 */
export const TABLE_EMPTY_MIN_HEIGHT = 288;

export const styles = {
  title: { display: "block" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** antd's own illustration; only the space around it is ours. */
    empty: { margin: 0, padding: token.paddingLG },
    description: { display: "block", marginTop: 4, color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
