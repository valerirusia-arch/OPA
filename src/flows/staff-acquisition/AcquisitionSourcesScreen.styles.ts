// src/flows/staff-acquisition/AcquisitionSourcesScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getStyles = (token: GlobalToken) =>
  ({
    quiet: { color: token.colorTextSecondary },
    /** A quiet value that must stay on one line — a date range wrapping to two
     *  rows looked broken in the campaigns table. */
    dateCell: { color: token.colorTextSecondary, whiteSpace: "nowrap" },
    code: { fontFamily: token.fontFamilyCode },
    inactiveRow: { color: token.colorTextTertiary },
    rowAction: { width: 40 },
    rowActionIcon: { fontSize: 18 },
    /** Tabs atop a flush table card — the tab bar takes the card's own inset so
     *  its labels line up with the table below, the same as the payments page. */
    tabBar: { paddingInline: 24, marginBottom: 0 },
  }) satisfies Record<string, CSSProperties>;
