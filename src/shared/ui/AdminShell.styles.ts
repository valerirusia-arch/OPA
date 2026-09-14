// src/shared/ui/AdminShell.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getFigureStyles } from "./figures.styles";

export const SIDER_WIDTH = 240;
export const SIDER_COLLAPSED_WIDTH = 72;

export const layout: CSSProperties = { minHeight: "100vh" };
/** Air under the logo rule; the first row should not sit against it. */
export const navMenu: CSSProperties = { borderInlineEnd: "none", paddingBlock: 12 };

export const getStyles = (token: GlobalToken) => {
  const figures = getFigureStyles(token);
  return ({
    sider: {
      background: token.colorBgContainer,
      borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
      position: "sticky",
      top: 0,
      height: "100vh",
      overflow: "auto",
    },
    brand: {
      height: 64,
      paddingInline: token.padding,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    /**
     * Section titles are signposts, not entries: smaller, spaced, upper case.
     *
     * antd indents a group title by 16px and gives it equal padding above and
     * below. Two corrections: 4px more on the start edge so the text lines up
     * with the icons at 20px, and extra space on top so the title sits nearer
     * the rows it names than the section it follows — a heading floating
     * midway between two groups belongs to neither.
     */
    groupLabel: {
      display: "block",
      ...figures.microLabel,
      marginInlineStart: 4,
      paddingTop: 12,
      /* The rail sets its own colour further down; only the type comes from
         the shared label. */
      color: undefined,
    },
    /** Quiet by default: a count, not an alarm. */
    badge: { color: token.colorTextSecondary },
    /** Chrome that is not navigation: language, notifications, the account. */
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: token.padding,
      height: 64,
      paddingInline: token.paddingLG,
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    },
    userButton: { height: 40, paddingInline: 8 },
    /** The work area. Screens bring their own padding where they need it. */
    content: { padding: 0 },
    /** The back office reads as a workspace, not a landing page. */
    body: { background: token.colorBgLayout },
    pageTitle: { marginTop: 0, marginBottom: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
};
