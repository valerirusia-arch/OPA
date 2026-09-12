// src/flows/profile/ProfileScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  page: { minHeight: "100vh" },
  /** The locked-fields explanation, stated once under the section title. */
  note: { marginBottom: 24 },
  noteIcon: { marginTop: 3 },
  noteText: { maxWidth: 560 },
  sectionTitle: { marginTop: 0, marginBottom: 16 },
  sectionSubtitle: { display: "block", marginTop: -8, marginBottom: 20 },
  alert: { marginBottom: 24 },
  actions: { marginTop: 8 },
  noMargin: { marginBottom: 0 },
  /** The notification channel, below the contact form's own rule. */
  preference: { marginTop: 8 },
  /** A single select, not a full-width field: it holds two words. */
  /** The two switches: a little room under the sentence that explains them. */
  channels: { marginTop: 8, maxWidth: 360 },
  preferenceField: { maxWidth: 240 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** A field label outside a Form.Item still has to look like one. */
    preferenceLabel: { fontWeight: 500, color: token.colorText },
  }) satisfies Record<string, CSSProperties>;
