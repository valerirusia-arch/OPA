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
  // Below sm the fixed desktop gutter squeezes the form to a sliver, so the
  // layout switches to a slim edge margin.
  const styles = getStyles(token, Boolean(screens.lg), screens.sm === false);

  return (
    <Flex style={styles.page}>
      <Flex vertical align="flex-start" style={styles.pane}>
        <Flex align="center" justify="space-between" style={content}>
          <Link to="/">
            <Logo />
          </Link>
          <LanguageSwitcher value={language} onChange={onLanguageChange} size="small" />
        </Flex>

        <Flex flex={1} align="center" style={content}>
          <div style={contentBlock}>{children}</div>
        </Flex>
      </Flex>

      {/* The brand family photo fills the hero panel (a background image, so no
          <img> element the antd-only rule forbids). */}
      {screens.lg && <div style={styles.aside} aria-hidden />}
    </Flex>
  );
}

export default AuthLayout;
