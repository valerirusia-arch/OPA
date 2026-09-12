// src/theme/ThemeProvider.tsx
//
// DESIGNER-OWNED. Wraps the app (and every Storybook story) in the one theme.
//
// Visual identity lives in ConfigProvider tokens — not CSS-in-JS, not CSS
// modules, not per-component hex. Exported as a NAMED export because both
// /src/app/router.tsx and .storybook/preview.tsx import it that way.
//
// The light/dark context and its hook live in ./themeMode so this file exports
// components only (Fast Refresh).

import { useMemo, useState, type ReactNode } from "react";
import { App as AntApp, ConfigProvider, theme } from "antd";
import { getTheme } from "./tokens";
import { getStyles } from "./ThemeProvider.styles";
import { ThemeModeContext, type ThemeMode } from "./themeMode";
import { LanguageProvider } from "../shared/ui/i18n/LanguageProvider";
import { RequiredAsterisk } from "../shared/ui/RequiredAsterisk";

/**
 * Inside ConfigProvider so it can read the resolved tokens. antd's App also
 * gives message/notification/modal the theme context.
 */
function Surface({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  return <AntApp style={styles.surface}>{children}</AntApp>;
}

/**
 * The wireframes put the required marker after the label ("Email *"), which is
 * also the convention on US financial forms. antd defaults to a leading
 * asterisk, so it is overridden once, here, for every form in the app.
 */
const RequiredMark = (label: ReactNode, { required }: { required: boolean }) => (
  <>
    {label}
    {required && <RequiredAsterisk />}
  </>
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const mode = useMemo<ThemeMode>(
    () => ({ isDark, toggleTheme: () => setIsDark((d) => !d) }),
    [isDark]
  );

  return (
    <ThemeModeContext.Provider value={mode}>
      {/* variant="filled" matches the wireframes: soft filled fields, no outline. */}
      <ConfigProvider
        theme={getTheme(isDark)}
        variant="filled"
        form={{
          requiredMark: RequiredMark,
          styles: {
            // The validation message is part of the field, so it keeps the
            // field's rhythm: a small gap above it, the form's normal 24px
            // below it.
            //
            // antd drops the item's bottom margin to zero while help is shown
            // (`.ant-form-item-with-help`) so that an error never moves the
            // layout. That leaves the message sitting on top of whatever
            // follows — on the sign-in and reset screens, the submit button.
            // Restoring the gap here makes the form grow to fit the message
            // instead, which is what the field's own spacing implies.
            help: { marginTop: 6, marginBottom: 24 },
            // The requirement hint sits off the field by the same 6px.
            extra: { marginTop: 6 },
          },
        }}
      >
        <LanguageProvider>
          <Surface>{children}</Surface>
        </LanguageProvider>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export default ThemeProvider;
