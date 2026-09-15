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
// the active label's weight is the control's own. Selecting a segment only
// weights its label — it adds no icon and changes no size, so the control does
// not jump as you switch; the white pill behind the label is what says "you
// are here".
//
// Dumb: value in, choice out, no state of its own.

import { Grid, Segmented } from "antd";
import { styles as s } from "./AudienceToggle.styles";

export type AudienceOption<V extends string> = {
  value: V;
  label: string;
  /** A shorter label used below sm, where the full one would truncate in a
   *  half-width segment. Falls back to `label` when omitted. */
  shortLabel?: string;
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
  // Below sm a half-width segment cannot hold "Borrower & Co-borrower", so a
  // shorter label is used there when one is supplied.
  const screens = Grid.useBreakpoint();
  const compact = screens.sm === false;

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
            {compact && option.shortLabel ? option.shortLabel : option.label}
          </span>
        ),
        title: "",
      }))}
    />
  );
}

export default AudienceToggle;
