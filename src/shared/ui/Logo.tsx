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

import type { CSSProperties } from "react";
import logoSrc from "./opa-symbol.png";
import { styles } from "./Logo.styles";

/**
 * ONE SIZE, AND IT IS THE SIGN-UP PAGE'S.
 *
 * The mark was drawn at four sizes — 28 on the auth screens, 22 and 20 in the
 * borrower's top bar, 18 in the back office's rail — none of them chosen
 * against the others, and at 18 it had shrunk to a smudge. The auth screens
 * are where a person meets the brand first and the size there is the size of
 * the brand: *"საინაფ ფეიჯზე რა ზომაც არის, ადმინზეც და ბოროვერის აპშიც იმ
 * ზომის გააკეთე."*
 *
 * It is the default rather than a constant every caller has to remember, so a
 * new placement is the right size by saying nothing.
 */
export const LOGO_HEIGHT = 28;

export type LogoProps = {
  /** Rendered height in px. The mark is square, so the width follows. */
  height?: number;
  /**
   * For the one placement that cannot state a pixel height: the card face,
   * whose every measurement is a fraction of its own width. It passes
   * `{ width: "100%", height: "100%" }` and lets the wrapper do the sizing.
   */
  style?: CSSProperties;
};

// The source PNG is 256×256 with the symbol filling the frame.
const SRC = 256;

export function Logo({ height = LOGO_HEIGHT, style }: LogoProps) {
  return (
    <svg
      height={height}
      width={height}
      viewBox={`0 0 ${SRC} ${SRC}`}
      role="img"
      aria-label="One Percent for America"
      style={style ? { ...styles.mark, ...style } : styles.mark}
    >
      <image href={logoSrc} x={0} y={0} width={SRC} height={SRC} />
    </svg>
  );
}

export default Logo;
