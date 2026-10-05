// src/flows/staff-users/StaffUsersScreen.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Wide enough for a full name and an address without truncating either. */
  search: { width: 300 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** "Set" is the ordinary case — it states a fact, it does not flag one. */
    quiet: { color: token.colorTextSecondary },
    /** A row whose account has been withdrawn reads dimmer than a live one. */
    inactiveRow: { color: token.colorTextTertiary },
    /**
     * An active user's name has nowhere to go — this list has no detail
     * page, only the row menu — so it stays plain text rather than the
     * product's link teal, but reads at full `colorTextBase` rather than
     * antd's dimmer default body text.
     */
    identifier: { color: token.colorTextBase },
    /**
     * The row menu is the only way into every action on this screen, so it has
     * to look like a control. At antd's inherited 14px the three dots read as
     * punctuation; larger and in the body colour they read as a button.
     */
    rowActionIcon: { fontSize: 20, color: token.colorText },
    /**
     * Sized to the text beside it, not to a form control. At antd's 48 the
     * button alone decided how tall every row was — see TABLE_ROW_HEIGHT.
     */
    rowAction: { width: 28, height: 28, minWidth: 28, padding: 0 },
  }) satisfies Record<string, CSSProperties>;
