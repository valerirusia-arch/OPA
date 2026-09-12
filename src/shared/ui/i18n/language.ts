// src/shared/ui/i18n/language.ts
//
// WBS: "Select the language for interface: English/Spanish".
//
// The chosen language is presentation state, so it lives in a plain React
// context — no store, no fetching. The dictionary below it is static UI copy;
// server-owned content (emails, documents) is translated during integration.
//
// The context and hook live apart from the provider component so Fast Refresh
// keeps working on both.

import { createContext, useContext } from "react";

export type Language = "en" | "es";

export type LanguageState = {
  language: Language;
  setLanguage: (value: Language) => void;
};

/** English by default, so a component rendered outside the provider (a
 *  Storybook story) still reads sensibly. */
export const LanguageContext = createContext<LanguageState>({
  language: "en",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);
