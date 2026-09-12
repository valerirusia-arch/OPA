// src/flows/staff-profile/StaffProfileScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The title and the role tag share a line. */
  titleRow: { marginBottom: 4 },
  sectionTitle: { marginTop: 0, marginBottom: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * The section's subtitle — the same Title + secondary-text pair every
     * other screen in the product uses. Not an Alert, and not an icon-and-line
     * of its own: nothing has gone wrong here, and a third treatment for
     * "explanatory sentence under a heading" is one too many.
     */
    note: { marginBottom: token.marginLG },
    noteIcon: { color: token.colorTextTertiary, marginTop: 3 },
    /** Short enough to stay on one line at the card's width. */
    description: { display: "block" },
  }) satisfies Record<string, CSSProperties>;
