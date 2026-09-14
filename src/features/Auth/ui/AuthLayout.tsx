// src/features/Auth/ui/AuthLayout.tsx
//
// The split screen shared by every unauthenticated page: brand + language on
// the left above the form, a panel on the right that collapses away below the
// lg breakpoint so the form stays usable on smaller windows.
//
// The right panel is the reserved slot for the hero image. The picture glyph
// marks it as "artwork pending" rather than leaving an unexplained empty box.
//
// Dumb: it renders whatever children it is given.

import type { ReactNode } from "react";
import { Flex, Grid, theme } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { LanguageSwitcher, type Language } from "../../../shared/ui/LanguageSwitcher";
import { Logo } from "../../../shared/ui/Logo";
import { content, contentBlock, getStyles } from "./AuthLayout.styles";

export type AuthLayoutProps = {
  children: ReactNode;
  language?: Language;
  onLanguageChange?: (value: Language) => void;
};

export function AuthLayout({ children, language, onLanguageChange }: AuthLayoutProps) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const styles = getStyles(token, Boolean(screens.lg));

  return (
    <Flex style={styles.page}>
      <Flex vertical align="flex-start" style={styles.pane}>
        <Flex align="center" justify="space-between" style={content}>
          <Link to="/">
            <Logo height={28} />
          </Link>
          <LanguageSwitcher value={language} onChange={onLanguageChange} size="small" />
        </Flex>

        <Flex flex={1} align="center" style={content}>
          <div style={contentBlock}>{children}</div>
        </Flex>
      </Flex>

      {screens.lg && (
        <Flex style={styles.aside} align="center" justify="center" aria-hidden>
          <PictureOutlined style={styles.asideIcon} />
        </Flex>
      )}
    </Flex>
  );
}

export default AuthLayout;
