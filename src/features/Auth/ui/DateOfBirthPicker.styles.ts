// src/features/Auth/ui/DateOfBirthPicker.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The field reads as an input but is only ever filled from the panel. */
  field: { width: "100%", cursor: "pointer" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    panel: {
      /** Wide enough for seven day columns, and no wider. */
      width: 320,
      padding: token.paddingSM,
      background: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary,
    },
    header: { marginBottom: token.marginXS },
    headerTitle: { fontWeight: 500 },
    /** Fixed columns rather than wrapping, so the grid fills the field's width. */
    yearGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 },
    monthGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 },
    dayGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 },
    cell: { paddingInline: 0 },
    icon: { color: token.colorTextQuaternary },
    /** Sits in the field's suffix, so it must not take the field's height. */
    clear: { color: token.colorTextQuaternary, height: 20, width: 20, minWidth: 20 },
  }) satisfies Record<string, CSSProperties>;
