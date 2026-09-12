// src/flows/invitation/CoBorrowerInvitationScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** The 48px every auth screen reserves above its card. */
  panel: { width: "100%", marginTop: 48 },
  result: { padding: 0 },
  signIn: { marginTop: 16 },
  divider: { marginTop: 24, marginBottom: 16 },
  meta: { fontSize: 13 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    metaIcon: { color: token.colorTextTertiary, fontSize: 13 },
    expiredBadge: { background: token.colorFillSecondary, color: token.colorTextTertiary },
    title: { marginTop: token.margin },
    subTitle: { maxWidth: 380, marginInline: "auto", marginTop: token.marginXS },
    extra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
