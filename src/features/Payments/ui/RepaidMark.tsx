// src/features/Payments/ui/RepaidMark.tsx
//
// A loan repaid in full.
//
// TWO IDEAS WERE TRIED AND BOTH CAME OFF. A party popper first — a borrowed
// image, and it read as one: a cone and confetti belong to a chat app, not to
// a lender whose borrower has just spent twelve months making payments. Then
// the instalment track closed into a ring, all twelve capsules green, on the
// argument that the product's own picture of repayment finishing is the
// truest thing it could draw. That argument still holds and the drawing still
// did not: *"გარედან უბრალოდ ეს მწვანე დეშები მოაშორე."*
//
// What was left both times was the tick — *"მომწონს ეს მარტივი პწიჩკა"* — so
// the tick is the mark. A stroke on a soft green disc, at the size the
// product's other table empties are drawn at, and nothing else on it.
//
// It is the plainest possible answer and that is the point: this is the one
// screen in the product where nothing is being asked of the reader. Every
// other illustration here has a job — the packet that says start one, the
// sheet with two people, the clock on an empty schedule. This one only has to
// agree with them.
//
// Drawn rather than composed because antd has no illustration to compose
// from; every colour comes from the theme.

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type RepaidMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function RepaidMark({ size = 148 }: RepaidMarkProps) {
  const { token } = theme.useToken();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* The same soft green the submitted mark stands on, so the two ends of
          a borrower's story share a colour. */}
      <circle cx="60" cy="60" r="42" fill={token.colorSuccessBg} />

      {/* The tick, at the weight the disc can carry. `success` rather than
          `successMark`: the lighter green is for artwork that has to sit
          beside text, and this stroke has a whole disc to itself. */}
      <path
        d="M44 61l11 11 21-22"
        stroke={brand.success}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default RepaidMark;
