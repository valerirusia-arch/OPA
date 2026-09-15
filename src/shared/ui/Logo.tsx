// src/shared/ui/Logo.tsx
//
// THE OPA WORDMARK — a monoline lowercase "opa".
//
// A single, even stroke draws three rounded letters in one colour, the mark's
// own periwinkle (brand.logo). It replaces the earlier overlapping-capitals
// mark at the designer's request, after a reference in that flowing monoline
// style. Hand-built from geometry rather than lifted from a vector — an exact
// copy of a specific logotype needs its own SVG — so it is an interpretation of
// that style, not a trace of one particular drawing.
//
// One stroke, one colour: no blend modes, no overlaps to darken.

import { brand } from "../../theme/tokens";
import { styles } from "./Logo.styles";

export type LogoProps = {
  /** Rendered height in px. The width follows the mark's own ratio. */
  height?: number;
};

const VIEW_W = 316;
const VIEW_H = 180;
const STROKE = 26;

export function Logo({ height = 28 }: LogoProps) {
  const stroke = {
    fill: "none",
    stroke: brand.logo,
    strokeWidth: STROKE,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      height={height}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="opa"
      style={styles.mark}
    >
      {/* o */}
      <circle cx={49} cy={84} r={36} {...stroke} />

      {/* p — a full bowl with a stem that descends below the baseline */}
      <path d="M120 48 V156" {...stroke} />
      <circle cx={156} cy={84} r={36} {...stroke} />

      {/* a — a bowl with an upright on its right, closed to the baseline */}
      <circle cx={252} cy={84} r={36} {...stroke} />
      <path d="M288 48 V120" {...stroke} />
    </svg>
  );
}

export default Logo;
