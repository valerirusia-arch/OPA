// src/shared/ui/buttonStates.styles.ts
//
// Shared button states that antd has no token for.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A primary button that cannot be pressed yet.
     *
     * antd greys a disabled button out completely, which makes the main action
     * look like it belongs to a different design. Keeping the brand colour and
     * dimming it says "this is the button, it is just not ready" — which is
     * what an untouched form means. antd's disabled cursor and click blocking
     * are untouched; only the paint changes.
     */
    idlePrimary: {
      background: token.colorPrimary,
      borderColor: token.colorPrimary,
      color: token.colorWhite,
      opacity: 0.4,
    },
  }) satisfies Record<string, CSSProperties>;
