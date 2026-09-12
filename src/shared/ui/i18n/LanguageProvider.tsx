// src/shared/ui/i18n/LanguageProvider.tsx
//
// Holds the selected interface language and hands antd its own locale, so the
// components we do not write copy for — DatePicker month names, Select's "no
// data", Modal buttons — follow the switch too.
//
// Mounted inside ThemeProvider, which is designer-owned, so turning the
// language on took no change in /app.

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LanguageContext, type Language } from "./language";

const locales = { en: enUS, es: esES };
/** antd reads the picker's month and weekday names from dayjs, not from its
 *  own locale bundle, so dayjs has to be switched alongside it. */
const dayjsLocales = { en: "en", es: "es" };

export function LanguageProvider({
  defaultLanguage = "en",
  children,
}: {
  defaultLanguage?: Language;
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const value = useMemo(() => ({ language, setLanguage }), [language]);

  useEffect(() => {
    dayjs.locale(dayjsLocales[language]);
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      <ConfigProvider locale={locales[language]}>{children}</ConfigProvider>
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
