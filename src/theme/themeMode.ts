// src/theme/themeMode.ts
//
// The light/dark switch, kept OUT of ThemeProvider.tsx on purpose: a file that
// exports both a component and a hook breaks Fast Refresh
// (react-refresh/only-export-components). Context + hook live here, the
// component lives next door.
//
// This is presentation plumbing only — no data, no store, no logic.

import { createContext, useContext } from "react";

export type ThemeMode = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeModeContext = createContext<ThemeMode>({
  isDark: false,
  toggleTheme: () => {},
});

/** Read/flip the light-dark mode (used by the DevBar's theme switch). */
export const useThemeMode = () => useContext(ThemeModeContext);
