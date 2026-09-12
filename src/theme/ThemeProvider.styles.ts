// src/theme/ThemeProvider.styles.ts
//
// The app surface. Without this the page background is whatever the browser
// paints (i.e. black under an OS dark theme) while antd's light theme is
// drawing black text on top of it — the kit deletes index.css, so nothing else
// sets it.
//
// Token-driven, per the co-located *.styles.ts convention: no CSS file, no hex.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getStyles = (token: GlobalToken) =>
  ({
    surface: {
      minHeight: "100vh",
      background: token.colorBgLayout,
      color: token.colorText,
    },
  }) satisfies Record<string, CSSProperties>;
