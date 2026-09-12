// src/features/Profile/ui/ProfileLayout.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken, ThemeConfig } from "antd";
import { contentRow } from "../../../shared/ui/grid";

/** Sized to sit in a row of content, not to head a page. */
export const AVATAR_SIZE = 64;

/**
 * The profile's fields sit further apart than a form's.
 *
 * A wizard step is a queue — you fill one field and move to the next, and
 * tight spacing keeps the queue short. This page is a reference: most of its
 * fields are locked, and the reader is scanning for one value rather than
 * working through all of them. Rows that stand apart are easier to scan.
 * Scoped here, so the wizard and the modals keep their own rhythm.
 */
export const formTheme: ThemeConfig = {
  components: { Form: { itemMarginBottom: 32 } },
};

export const styles = {
  /**
   * The menu is its own card on the page's grey, beside a second card holding
   * the content — an account area you navigate, the way a bank's is.
   *
   * A full-bleed alternative was built and compared against it in the running
   * app: one white surface with the rail as a column of the same card. This
   * won, so the other is gone rather than left behind a switch.
   */
  page: { ...contentRow, paddingBlock: 32 },
  /** The rows carry their own inset, so the card adds none. */
  menuCardBody: { padding: 0 },
  contentCard: { height: "100%" },
  /** Padded to sit level with the content beside it, not tucked into a corner. */
  navList: { padding: 20 },
  /** Soft pills, 2px apart, inset from the card's edge. */
  navItem: { width: "100%", justifyContent: "flex-start", textAlign: "start" },
  /** The person, at the head of the content card. */
  identity: { marginBottom: 20 },
  identityDivider: { marginTop: 0, marginBottom: 24 },
  name: { marginTop: 0, marginBottom: 2 },
  meta: { display: "block" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    navItemActive: {
      background: token.colorPrimaryBg,
      color: token.colorPrimary,
      fontWeight: 500,
    },
  }) satisfies Record<string, CSSProperties>;
