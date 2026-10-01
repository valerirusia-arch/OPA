// src/shared/ui/LogoLockup.tsx
//
// THE FULL ONE PERCENT FOR AMERICA LOCKUP — the flame symbol beside the
// wordmark, the brand's horizontal signature. The compact `Logo` (the symbol
// alone) stays for tight spots — a card face, the virtual-card modal — while
// this full lockup signs the pages a person reads top-down: the registration
// wizard, the borrower's top bar, the back-office rail.
//
// It is the OFFICIAL artwork (src/assets/brand/opa-logo.svg), never a redrawn
// imitation, and it is referenced through an <svg><image> so the file's own
// brand colours stay in the asset — no hex reaches this component, so the
// antd-only / no-raw-hex rule holds, the same way `Logo` renders its PNG.

import type { CSSProperties } from "react";
import logoSrc from "../../assets/brand/opa-logo.svg";
import { styles } from "./Logo.styles";

/** The source lockup's own frame — a wide horizontal artboard. */
const W = 300;
const H = 78;

/**
 * The default height, tuned to sit level with a page title without towering
 * over the top bar it shares. Callers that need it larger (a splash) or smaller
 * (a dense rail) pass their own.
 */
export const LOCKUP_HEIGHT = 30;

export type LogoLockupProps = {
  /** Rendered height in px; the width follows the lockup's aspect ratio. */
  height?: number;
  style?: CSSProperties;
};

export function LogoLockup({ height = LOCKUP_HEIGHT, style }: LogoLockupProps) {
  return (
    <svg
      height={height}
      width={height * (W / H)}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="One Percent for America"
      style={style ? { ...styles.mark, ...style } : styles.mark}
    >
      <image href={logoSrc} x={0} y={0} width={W} height={H} />
    </svg>
  );
}

export default LogoLockup;
