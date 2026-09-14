// src/shared/ui/StatusDonut.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

const SIZE = 160;

export const styles = {
  root: { width: "100%" },
  ring: { position: "relative", width: SIZE, height: SIZE },
  svg: { width: SIZE, height: SIZE, display: "block" },
  center: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  legend: { width: "100%" },
  dot: { width: 10, height: 10, borderRadius: 5, flex: "none" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    centerLabel: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: token.colorTextTertiary,
    },
    centerValue: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1.1,
      color: token.colorText,
      fontVariantNumeric: "tabular-nums",
    },
    legendLabel: { color: token.colorText },
    legendValue: { color: token.colorText, fontWeight: 500, fontVariantNumeric: "tabular-nums" },
  }) satisfies Record<string, CSSProperties>;
