// src/features/Profile/ui/ProfileLayout.tsx
//
// The profile as an account area: a menu card of sections beside a card
// holding the one you are in.
//
// A second layout was built alongside this one — a single full-bleed white
// surface with the rail as a column of the same card — and the two were
// compared on real content in the running app rather than argued about from
// memory. This is the one that was kept.
//
// The person heads the CONTENT card rather than the page: full width they were
// a banner competing with the menu, and the menu beside them had nothing to do
// with them anyway.
//
// Dumb: sections, the active one and the person all arrive as props.

import type { ReactNode } from "react";
import { Button, Card, Col, ConfigProvider, Divider, Flex, Row, Typography, theme } from "antd";
import { InitialsAvatar } from "../../../shared/ui/InitialsAvatar";
import { AVATAR_SIZE, formTheme, getStyles, styles } from "./ProfileLayout.styles";

export type ProfileSection = {
  key: string;
  label: string;
  /** Drawn beside the label, so the menu reads as a list of destinations. */
  icon?: ReactNode;
};

export type ProfileLayoutProps = {
  /** Whose profile this is. */
  name?: string;
  /** A quiet second line — an email, a city, a role. */
  meta?: ReactNode;
  /** Omitted, the content card runs the full width with no menu beside it. */
  sections?: ProfileSection[];
  activeKey?: string;
  onSectionChange?: (key: string) => void;
  children: ReactNode;
};

export function ProfileLayout({
  name,
  meta,
  sections,
  activeKey,
  onSectionChange,
  children,
}: ProfileLayoutProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  const identity = name ? (
    <>
      <Flex align="center" gap={16} style={styles.identity}>
        <InitialsAvatar name={name} size={AVATAR_SIZE} />
        <Flex vertical>
          <Typography.Title level={4} style={styles.name}>
            {name}
          </Typography.Title>
          {meta ? (
            <Typography.Text type="secondary" style={styles.meta}>
              {meta}
            </Typography.Text>
          ) : null}
        </Flex>
      </Flex>
      <Divider style={styles.identityDivider} />
    </>
  ) : null;

  const content = (
    <>
      {identity}
      <ConfigProvider theme={formTheme}>{children}</ConfigProvider>
    </>
  );

  // No sections — the staff profile — is the same page with the menu card left
  // out, not a different layout. One card on the grid, full width.
  if (!sections?.length) {
    return (
      <div style={styles.page}>
        <Card>{content}</Card>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} md={8} lg={7}>
          <Card styles={{ body: styles.menuCardBody }}>
            <Flex vertical gap={2} style={styles.navList}>
              {sections.map((section) => (
                <Button
                  key={section.key}
                  type="text"
                  size="large"
                  icon={section.icon}
                  style={
                    section.key === activeKey
                      ? { ...styles.navItem, ...s.navItemActive }
                      : styles.navItem
                  }
                  onClick={() => onSectionChange?.(section.key)}
                >
                  {section.label}
                </Button>
              ))}
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={16} lg={17}>
          <Card style={styles.contentCard}>{content}</Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProfileLayout;
