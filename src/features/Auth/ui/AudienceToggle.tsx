// src/features/Auth/ui/AudienceToggle.tsx
//
// The login screen's two-choice switcher: Borrower & Co-borrower / OPA staff.
//
// Four designs were built and compared live on the real screen behind a dev
// switch — a segmented pill, underline tabs, plain text, and selection cards.
// The pill won; the others and the switch were deleted. Git history holds them
// if the comparison is ever wanted again.
//
// antd Segmented, drawn from the global Segmented tokens (see tokens.ts): only
// the active label's weight and the icon size are the control's own. The active
// segment alone carries its icon, so it reads as "you are here" rather than
// decoration.
//
// Dumb: value in, choice out, no state of its own.

import type { ReactNode } from "react";
import { Segmented } from "antd";
import { styles as s } from "./AudienceToggle.styles";

export type AudienceOption<V extends string> = {
  value: V;
  label: string;
  icon: ReactNode;
};

export type AudienceToggleProps<V extends string> = {
  value: V;
  onChange: (value: V) => void;
  options: AudienceOption<V>[];
};

export function AudienceToggle<V extends string>({
  value,
  onChange,
  options,
}: AudienceToggleProps<V>) {
  return (
    <Segmented<V>
      block
      size="large"
      style={s.segmented}
      value={value}
      onChange={onChange}
      // title="" suppresses the native tooltip antd derives from the label.
      options={options.map((option) => ({
        value: option.value,
        label: (
          <span style={value === option.value ? s.pillActive : undefined}>
            {option.label}
          </span>
        ),
        icon: value === option.value ? <span style={s.pillIcon}>{option.icon}</span> : undefined,
        title: "",
      }))}
    />
  );
}

export default AudienceToggle;
