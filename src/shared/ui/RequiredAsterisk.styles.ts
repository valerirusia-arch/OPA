// src/shared/ui/RequiredAsterisk.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getStyles = (token: GlobalToken) =>
  ({
    mark: { marginInlineStart: token.marginXXS },
  }) satisfies Record<string, CSSProperties>;
