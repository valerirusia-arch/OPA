// src/shared/ui/AdminShell.tsx
//
// The back-office frame: OPA staff work here, borrowers never see it.
//
// It is a different shell on purpose, not a re-skin of the borrower portal.
// Staff sign in through Microsoft Entra ID, their accounts are created by an
// Admin, and every story the WBS gives them — users management, the borrower
// and application lists, decisioning, reporting — belongs to a workspace with
// a standing navigation rail, not to a customer-facing site with a top bar.
//
// The top bar carries the language switch and the account menu, and nothing
// else. The WBS asks for no notification centre in the back office, but it
// does give "select the interface language: English/Spanish" to every user —
// staff included — so the switch belongs here.
//
// Entries whose epic has not been built yet render disabled rather than
// linking somewhere that does not exist.
//
// Dumb: navigation, the user's name and every action arrive through props.

import { useState, type ReactNode } from "react";
import {
  Badge,
  Button,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Layout,
  Menu,
  Space,
  Typography,
  theme,
} from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { InitialsAvatar } from "./InitialsAvatar";
import { Link } from "@tanstack/react-router";
import { LanguageSwitcher, type Language } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { useT } from "./i18n/useT";
import type { NavItem, NavSection } from "./navigation";
import {
  SIDER_WIDTH,
  getStyles,
  layout,
  navMenu,
} from "./AdminShell.styles";

export type AdminShellProps = {
  sections: NavSection[];
  activeKey?: string;
  userName: string;
  /** Where the account menu's "My profile" entry points. */
  profileTo: string;
  language?: Language;
  onLanguageChange?: (value: Language) => void;
  onLogout?: () => void;
  children: ReactNode;
};

export function AdminShell({
  sections,
  activeKey,
  userName,
  profileTo,
  language,
  onLanguageChange,
  onLogout,
  children,
}: AdminShellProps) {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  const t = useT();
  const screens = Grid.useBreakpoint();
  // Below antd's `lg` (992px) the standing rail becomes a burger + drawer: a
  // permanent sider on a phone leaves a customer-list column two words wide.
  // Default to the rail until a breakpoint is actually measured, so the desktop
  // layout never flashes a burger on first paint.
  const compact = screens.lg === false;
  const [navOpen, setNavOpen] = useState(false);

  // The group holding the current page, so a rail arrived at by URL or reload
  // opens it and shows you where you are. Without this the selected child is
  // hidden inside a collapsed group and the rail looks like nothing is active.
  const activeParent = sections
    .flatMap((section) => section.items)
    .find((item) => item.children?.some((child) => child.key === activeKey))?.key;
  // Seeded, not controlled, so you can still collapse the group you are in.
  // Each screen renders its own AdminShell, so navigating remounts this and the
  // seed is recomputed — the state never goes stale against activeKey.
  const [openKeys, setOpenKeys] = useState<string[]>(activeParent ? [activeParent] : []);

  /** A count sits at the end of the row, where a rail's eye already scans. */
  const label = (item: NavItem) => {
    const text = item.to ? <Link to={item.to}>{t(item.labelKey)}</Link> : t(item.labelKey);
    if (item.badge === undefined) return text;
    return (
      <Flex align="center" justify="space-between" gap={8}>
        {text}
        <Badge count={item.badge} color={token.colorFillSecondary} style={styles.badge} />
      </Flex>
    );
  };

  const toMenuItem = (item: NavItem) => ({
    key: item.key,
    icon: item.icon,
    // A group whose children all lead nowhere yet is not a destination
    // either — it reads disabled like the rest, instead of looking selected.
    disabled: !item.to && !item.children?.some((child) => child.to),
    label: label(item),
    children: item.children?.map((child) => ({
      key: child.key,
      disabled: !child.to,
      label: label(child),
    })),
  });

  const navMenu_ = (
    <Menu
      mode="inline"
      // antd writes the row's left padding as an inline style derived from
      // this, which beats any token — 12 here plus the row's own 8px margin
      // puts every icon 20px from the rail's edge, level with the section
      // titles. Nested entries still step in by one unit.
      inlineIndent={12}
      selectedKeys={activeKey ? [activeKey] : []}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      style={navMenu}
      // In the drawer, choosing a destination should also dismiss it.
      onClick={() => setNavOpen(false)}
      items={sections.map((section) => ({
        key: section.key,
        type: "group" as const,
        label: <span style={styles.groupLabel}>{t(section.labelKey)}</span>,
        children: section.items.map(toMenuItem),
      }))}
    />
  );

  return (
    <Layout style={layout}>
      {compact ? (
        <Drawer
          placement="left"
          open={navOpen}
          onClose={() => setNavOpen(false)}
          width={SIDER_WIDTH}
          title={<Logo />}
          styles={{ body: styles.drawerBody }}
        >
          {navMenu_}
        </Drawer>
      ) : (
        <Layout.Sider theme="light" width={SIDER_WIDTH} style={styles.sider}>
          <Flex align="center" style={styles.brand}>
            <Logo />
          </Flex>
          {navMenu_}
        </Layout.Sider>
      )}

      <Layout style={styles.body}>
        <Layout.Header style={styles.header}>
          {compact ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setNavOpen(true)}
              aria-label={t("nav.openMenu")}
              style={styles.burger}
            />
          ) : null}

          <LanguageSwitcher value={language} onChange={onLanguageChange} size="small" />

          <Dropdown
            menu={{
              items: [
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: <Link to={profileTo}>{t("header.myProfile")}</Link>,
                },
                { type: "divider" },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: t("header.logOut"),
                  onClick: onLogout,
                },
              ],
            }}
          >
            <Button type="text" style={styles.userButton}>
              <Space size="small">
                <InitialsAvatar name={userName} size={28} />
                <Typography.Text>{userName}</Typography.Text>
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Layout.Header>

        <Layout.Content style={styles.content}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AdminShell;
