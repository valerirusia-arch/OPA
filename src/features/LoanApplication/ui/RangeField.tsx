// src/features/LoanApplication/ui/RangeField.tsx
//
// A number field the size of the answer it collects, with a slider under it.
//
// The annual income is the single most consequential number a borrower types
// into this product — underwriting reads it first — and in a plain input it
// looks exactly like the document type below it. Given the room, it reads back
// at a glance and a typo is obvious before the form is submitted, which a
// 14px "40000" in a grey box never is.
//
// The slider is not decoration either. Most people do not know their household
// income to the dollar; they know roughly where it sits. Dragging gets them
// there in one gesture and shows the figure moving as they go, and anyone who
// does know the number can still type it — including one above the slider's
// range, which simply pins the handle to the end.
//
// Money or a count: the only difference is the prefix and how the ends of the
// scale are written.
//
// Dumb: it takes a value and reports a value. antd's Form supplies both.

import { useState } from "react";
import { Flex, InputNumber, Slider, Typography, theme } from "antd";
import { fontSizeFor, getStyles, styles } from "./RangeField.styles";

export type RangeFieldProps = {
  /** Supplied by Form.Item. */
  value?: number | null;
  onChange?: (value: number | null) => void;
  /** Set at the size of the value itself — "$" for money, nothing for a count. */
  prefix?: string;
  /** The slider's range. Typing above `max` is still allowed. */
  min?: number;
  max?: number;
  step?: number;
  /** How the ends of the scale are written. */
  formatScale?: (value: number) => string;
  /** Marks the top of the scale as a floor, not a ceiling. */
  openEnded?: boolean;
  /** A numeral, not copy — the swap-field convention, and it needs no translating. */
  placeholder?: string;
  /** Sized down for a field that shares its row with another. */
  compact?: boolean;
  disabled?: boolean;
};

/** 40000 -> "40,000". Grouping only; the stored value stays a number. */
const group = (raw: string | number | null | undefined) => {
  const digits = String(raw ?? "").replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
};

export function RangeField({
  value,
  onChange,
  prefix = "$",
  min = 0,
  max = 250_000,
  step = 1_000,
  formatScale = (amount) => `$${group(amount)}`,
  openEnded = true,
  placeholder = "0",
  compact = false,
  disabled,
}: RangeFieldProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  // Local UI state only: which surface to draw. Nothing leaves the component.
  const [focused, setFocused] = useState(false);

  // Sized off what is actually on screen — the prefix and commas take room too.
  const rendered = `${prefix}${group(value) || placeholder}`;
  const type = { ...s.value, fontSize: fontSizeFor(rendered, compact) };
  /**
   * The prefix greys out with the placeholder it sits next to.
   *
   * antd already draws the placeholder digits in placeholder ink, but the "$"
   * is ours and was drawn in full — so an untouched field read "$ 0" with half
   * of it looking typed in. Either the whole figure is an answer or none of it
   * is.
   */
  const empty = value === undefined || value === null;
  const prefixType = empty ? { ...type, color: token.colorTextPlaceholder } : type;

  const scaleType = compact ? styles.scaleCompact : styles.scale;
  const surface = {
    ...s.surface,
    ...(compact ? s.surfaceCompact : null),
    ...(focused ? s.surfaceFocused : null),
  };

  return (
    <Flex vertical style={surface}>
      <InputNumber<number>
        variant="borderless"
        controls={false}
        value={value ?? undefined}
        onChange={(next) => onChange?.(next ?? null)}
        min={min}
        prefix={prefix ? <span style={prefixType}>{prefix}</span> : undefined}
        formatter={group}
        parser={(text) => Number(String(text).replace(/\D/g, ""))}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...styles.input, ...type }}
      />

      {/* Pinned to the end for anything above the range, so a typed figure the
          slider cannot express still leaves the handle somewhere honest. */}
      <Slider
        value={Math.min(Math.max(value ?? min, min), max)}
        onChange={(next) => onChange?.(next)}
        min={min}
        max={max}
        step={step}
        tooltip={{ open: false }}
        disabled={disabled}
        style={compact ? styles.sliderCompact : styles.slider}
      />

      {/* The ends of the range, which is what the reader needs to judge where
          the handle is — a tooltip would only repeat the number above. */}
      <Flex justify="space-between">
        <Typography.Text type="secondary" style={scaleType}>
          {formatScale(min)}
        </Typography.Text>
        <Typography.Text type="secondary" style={scaleType}>
          {openEnded ? `${formatScale(max)}+` : formatScale(max)}
        </Typography.Text>
      </Flex>
    </Flex>
  );
}

export default RangeField;
