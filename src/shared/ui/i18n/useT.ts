// src/shared/ui/i18n/useT.ts
//
// The translator hook. `t("login.title")` returns the string for the current
// language; `t("session.description", { seconds: 30 })` fills {seconds} in.

import { useCallback } from "react";
import { dictionary, en, type TranslationKey } from "./dictionary";
import { useLanguage } from "./language";

export type TranslationVars = Record<string, string | number>;

const fill = (template: string, vars?: TranslationVars) =>
  vars
    ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match
      )
    : template;

export function useT() {
  const { language } = useLanguage();

  return useCallback(
    (key: TranslationKey, vars?: TranslationVars) =>
      // English is the fallback: a missing translation shows real copy, never
      // a raw key.
      fill(dictionary[language][key] || en[key], vars),
    [language]
  );
}

export type Translate = ReturnType<typeof useT>;
