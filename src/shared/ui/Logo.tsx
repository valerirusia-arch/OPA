// src/shared/ui/Logo.tsx
//
// THE OPA WORDMARK.
//
// The designer's own artwork: a flowing, infinity-style lowercase "opa" in the
// brand periwinkle. It is a raster (PNG) placed inside an <svg> via <image>, so
// it stays within the antd-only rule's SVG exception and scales cleanly to any
// height. The viewBox frames just the artwork inside the square source file, so
// the mark fills its box instead of floating in the file's whitespace.

import logoSrc from "./opa-logo.png";
import { styles } from "./Logo.styles";

export type LogoProps = {
  /** Rendered height in px. The width follows the mark's own ratio. */
  height?: number;
};

// The source PNG is 1254×1254 with the wordmark centred in whitespace; this box
// crops to the ink.
const SRC = 1254;
const BOX = { x: 150, y: 455, w: 952, h: 408 };

export function Logo({ height = 28 }: LogoProps) {
  return (
    <svg
      height={height}
      viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
      role="img"
      aria-label="opa"
      style={styles.mark}
    >
      <image href={logoSrc} x={0} y={0} width={SRC} height={SRC} />
    </svg>
  );
}

export default Logo;
