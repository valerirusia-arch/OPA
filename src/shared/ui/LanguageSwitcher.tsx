// src/shared/ui/LanguageSwitcher.tsx
//
// WBS: "Select the language for interface: English/Spanish".
//
// It reads and writes the language context by default, so dropping it on a
// screen is enough to make that screen switchable. Props still win when a
// caller wants to drive it (a Storybook story, a controlled preview).

import { Select } from "antd";
import { useLanguage, type Language } from "./i18n/language";
import { useT } from "./i18n/useT";

export type { Language };

export type LanguageSwitcherProps = {
  value?: Language;
  onChange?: (value: Language) => void;
  size?: "small" | "middle" | "large";
};

// title="" suppresses the native tooltip antd derives from a string label.
const options = [
  { value: "en" as const, label: "🇺🇸 EN", title: "" },
  { value: "es" as const, label: "🇪🇸 ES", title: "" },
];

export function LanguageSwitcher({ value, onChange, size = "middle" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const t = useT();

  return (
    <Select
      size={size}
      value={value ?? language}
      onChange={onChange ?? setLanguage}
      options={options}
      // No container. Two letters and a caret are not a field you fill in —
      // a filled box gives the language switch the same weight as the search
      // box beside it, which is not the weight it deserves.
      variant="borderless"
      popupMatchSelectWidth={false}
      aria-label={t("header.language")}
    />
  );
}

export default LanguageSwitcher;
