// src/shared/ui/AdminPage.tsx
//
// One page inside the back-office shell: a heading, the actions that belong to
// the page as a whole, and the work below.
//
// AdminShell deliberately gives its content area no padding — full-bleed
// screens exist (the profile's banner). Everything else wraps itself in this,
// so every back-office page starts on the same margin.
//
// Dumb: title, actions and content all arrive as props.

import type { ReactNode } from "react";
import { ConfigProvider, Flex, Typography } from "antd";
import { styles, toolbarTheme } from "./AdminPage.styles";

export type AdminPageProps = {
  title: ReactNode;
  /** Sits to the right of the heading: search, filters, the primary action. */
  extra?: ReactNode;
  /**
   * A line under the toolbar, still outside the card — what the toolbar has
   * done to the content below, e.g. the filters currently applied. Renders
   * nothing when it is empty, so an untouched page keeps its layout.
   */
  toolbarBelow?: ReactNode;
  /** Shown immediately after the title — a tag, a flag, a badge. */
  titleAfter?: ReactNode;
  /** Shown before the title — usually a way back. */
  titleBefore?: ReactNode;
  children: ReactNode;
};

export function AdminPage({
  title,
  extra,
  toolbarBelow,
  titleAfter,
  titleBefore,
  children,
}: AdminPageProps) {
  return (
    <div style={styles.page}>
      <Flex
        align="center"
        justify="space-between"
        gap={16}
        wrap
        style={styles.titleRow}
      >
        {/* Wraps so a long applicant name plus the id and status tag beside it
            fall onto a second line on a phone, rather than squeezing the id
            column down to one character per line. */}
        <Flex align="center" gap={12} wrap>
          {titleBefore}
          <Typography.Title level={2} style={styles.title}>
            {title}
          </Typography.Title>
          {titleAfter}
        </Flex>
        {extra ? (
          <ConfigProvider theme={toolbarTheme}>
            <Flex align="center" gap={12} wrap>
              {extra}
            </Flex>
          </ConfigProvider>
        ) : null}
      </Flex>
      {toolbarBelow}
      {children}
    </div>
  );
}

export default AdminPage;
