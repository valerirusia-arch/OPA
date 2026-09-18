// src/shared/ui/Logo.tsx
//
// THE ONE PERCENT FOR AMERICA MARK.
//
// The brand's own symbol — a teal circle with a white flame — from the
// company site (opa-symbol-blue.png). It replaces the old lowercase "opa"
// wordmark. A raster (PNG) placed inside an <svg> via <image>, so it stays
// within the antd-only rule's SVG exception and scales cleanly to any height.
// The source is a 256×256 square, so the mark renders square at the given
// height.

import logoSrc from "./opa-symbol.png";
import { styles } from "./Logo.styles";

export type LogoProps = {
  /** Rendered height in px. The mark is square, so the width follows. */
  height?: number;
};

// The source PNG is 256×256 with the symbol filling the frame.
const SRC = 256;

export function Logo({ height = 28 }: LogoProps) {
  return (
    <svg
      height={height}
      width={height}
      viewBox={`0 0 ${SRC} ${SRC}`}
      role="img"
      aria-label="One Percent for America"
      style={styles.mark}
    >
      <image href={logoSrc} x={0} y={0} width={SRC} height={SRC} />
    </svg>
  );
}

export default Logo;
