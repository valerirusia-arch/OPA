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

/**
 * The tree connector for a nested nav item.
 *
 * Each child carries a rounded elbow that branches off a vertical rail to its
 * label; a non-last child continues the rail down to the next elbow, and the
 * last child's elbow closes it. The rail is drawn INSIDE the label (shifted
 * left with a negative margin the padding gives back), because antd owns the
 * submenu's own DOM. Geometry is tuned to the inline item: 40px tall on a 42px
 * pitch, so each 21px half-segment meets the next exactly and the rail reads as
 * one continuous line.
 */
function TreeBranch({
  isLast,
  color,
  children,
}: {
  isLast: boolean;
  color: string;
  children: ReactNode;
}) {
  const W = 1.5;
  const HALF = 21;
  const RAIL = 14;
  const TICK = 11;
  const X = 1;
  const line = `${W}px solid ${color}`;
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginInlineStart: -RAIL, paddingInlineStart: RAIL }}>
      {/* Rounded elbow: the rail's top half plus the branch to the label. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: X,
          top: `calc(50% - ${HALF}px)`,
          width: TICK,
          height: HALF,
          borderLeft: line,
          borderBottom: line,
          borderBottomLeftRadius: 8,
        }}
      />
      {/* The rail's bottom half, carrying it on to the next child. */}
      {!isLast ? (
        <span
          aria-hidden
          style={{ position: "absolute", left: X, top: "50%", height: HALF, borderLeft: line }}
        />
      ) : null}
      {children}
    </span>
  );
}

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
    children: item.children?.map((child, index, siblings) => ({
      key: child.key,
      disabled: !child.to,
      // A tree connector runs down the left of the children — a continuous rail
      // with a rounded elbow branching to each label, the last one closing it.
      label: (
        <TreeBranch isLast={index === siblings.length - 1} color={token.colorBorder}>
          {label(child)}
        </TreeBranch>
      ),
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
          title={<Logo height={18} />}
          styles={{ body: styles.drawerBody }}
        >
          {navMenu_}
        </Drawer>
      ) : (
        <Layout.Sider theme="light" width={SIDER_WIDTH} style={styles.sider}>
          <Flex align="center" style={styles.brand}>
            <Logo height={18} />
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
