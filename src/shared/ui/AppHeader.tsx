// src/shared/ui/AppHeader.tsx
//
// The signed-in top bar from the wireframes: logo, primary navigation,
// language, notifications, account menu.
//
// Dumb: the nav items, the active key, the user's name and every action arrive
// through props. Two audiences use it — borrowers and OPA staff — so the caller
// passes the nav it wants rather than the component knowing about roles.

import {
  Badge,
  Button,
  ConfigProvider,
  Dropdown,
  Popover,
  Flex,
  Grid,
  Menu,
  Space,
  Typography,
  theme,
} from "antd";
import type { ReactNode } from "react";
import { BellOutlined, DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { InitialsAvatar } from "./InitialsAvatar";
import { Link } from "@tanstack/react-router";
import { LanguageSwitcher, type Language } from "./LanguageSwitcher";
import { useT } from "./i18n/useT";
import type { NavItem } from "./navigation";
import {
  badgeOffset,
  getStyles,
  navMenu,
  navTheme,
  popoverPanel,
  userButton,
} from "./AppHeader.styles";

export type AppHeaderProps = {
  navItems: NavItem[];
  activeKey?: string;
  userName: string;
  /** Where the account menu's "My profile" entry points. */
  profileTo: string;
  /**
   * The bell's panel.
   *
   * The header has carried a bell since Epic 1 with nothing behind it; the
   * Notifications epic's wireframe hangs the Inbox off it. Passed in rather
   * than built here because this bar is shared with the back office, whose
   * notifications the WBS sends by email only ("Notification through email"),
   * so there is nothing for that audience to open.
   */
  notifications?: ReactNode;
  notificationCount?: number;
  language?: Language;
  onLanguageChange?: (value: Language) => void;
  onLogout?: () => void;
};

export function AppHeader({
  navItems,
  activeKey,
  userName,
  profileTo,
  notifications,
  notificationCount = 0,
  language,
  onLanguageChange,
  onLogout,
}: AppHeaderProps) {
  const { token } = theme.useToken();
  const t = useT();

  /**
   * Narrow enough that the bar cannot hold everything.
   *
   * antd's own breakpoint hook rather than a media query: there is no
   * stylesheet in src/ by design, and this is a layout decision the component
   * has to make in JS anyway — the name is removed from the DOM, not hidden
   * with CSS, so it never gets read out to a screen reader as invisible text.
   */
  const screens = Grid.useBreakpoint();
  const compact = screens.md === false;
  const styles = getStyles(token, compact);

  return (
    <Flex component="header" style={styles.header} align="center">
      <div style={styles.inner}>
      <Link to="/" aria-label={t("header.home")}>
        <div style={styles.logoPlaceholder} />
      </Link>

      <ConfigProvider theme={navTheme}>
        <Menu
          mode="horizontal"
          selectedKeys={activeKey ? [activeKey] : []}
          style={navMenu}
          items={navItems.map((item) => ({
            key: item.key,
            disabled: !item.to,
            label: item.to ? (
              <Link to={item.to}>{t(item.labelKey)}</Link>
            ) : (
              t(item.labelKey)
            ),
          }))}
        />
      </ConfigProvider>

      {/*
        Never shrinks.

        This was allowed to, and that is why the bar broke at 375px: the Flex
        divided the space between the menu and this block, so antd's Menu was
        handed a width it then overran — measured, `Loan` and `Payments` were
        drawn ON TOP of the avatar and the name. Pinning this block means the
        menu is the one that gives way, and a horizontal Menu that runs out of
        room collapses its items into its own overflow control, which is what
        it is for.
      */}
      <Space size={compact ? "small" : "middle"} align="center" style={styles.account}>
        <LanguageSwitcher value={language} onChange={onLanguageChange} size="small" />

        {/* The bell, and what it opens. `trigger="click"` rather than hover:
            the panel carries switches and a list of links, and a surface that
            vanishes when the pointer leaves it cannot hold either. */}
        <Popover
          content={notifications}
          trigger="click"
          placement="bottomRight"
          arrow={false}
          styles={{ container: popoverPanel }}
          /* Nothing to open on the staff side; the bell then behaves as it
             always has, which is as a count. */
          open={notifications ? undefined : false}
        >
          {/* PULLED ONTO THE BELL. antd pins the count to the corner of the
              element it wraps, and that element is a text button whose box is
              a good deal wider than the glyph inside it — so the badge came
              out floating in the header's whitespace, attached to nothing the
              eye can see. The offset lands it on the bell's own top right. */}
          <Badge count={notificationCount} size="small" offset={badgeOffset}>
            <Button type="text" icon={<BellOutlined />} aria-label={t("header.notifications")} />
          </Badge>
        </Popover>

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
          <Button type="text" style={userButton} aria-label={userName}>
            <Space size="small">
              <InitialsAvatar name={userName} size={28} />
              {/* The name goes on a narrow bar. The initials still identify
                  whose session this is, and the button keeps the full name as
                  its accessible label. */}
              {compact ? null : <Typography.Text>{userName}</Typography.Text>}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
      </div>
    </Flex>
  );
}

export default AppHeader;
