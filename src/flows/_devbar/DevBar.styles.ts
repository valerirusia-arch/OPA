// src/flows/_devbar/DevBar.styles.ts
//
// Style objects for the DevBar, kept out of the JSX (the kit convention:
// co-located *.styles.ts, never scattered inline). Static objects are exported
// directly; the token-dependent ones come from getStyles(token) so they still
// read from the theme instead of hardcoding anything — no CSS-in-JS, no hex.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const barInner: CSSProperties = { height: "100%" };
export const tagFlush: CSSProperties = { margin: 0 };
export const selectStyle: CSSProperties = { width: 340 };
export const spacer: CSSProperties = { height: 44 };

export const getStyles = (token: GlobalToken) =>
  ({
    bar: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      height: 44, padding: "0 12px",
      background: token.colorBgElevated,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: token.boxShadowTertiary,
    },
    pathTag: { margin: 0, fontFamily: token.fontFamilyCode },
  }) satisfies Record<string, CSSProperties>;

