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
// the tick is the mark: a stroke on a soft green disc, at the size the
// product's other table empties are drawn at.
//
// AND A BURST AROUND IT — *"მინდა რომ გარედან ეს ფეიერვერკების ნაწილაკები
// ჰქონდეს, ფერადი."* Eight rays on an even 45°, in the brand's four colours,
// starting clear of the disc and pointing out of it. Even spacing is what
// makes the difference between a firework and litter: the confetti squares
// that were here before fell wherever there was room, so three of them read
// as scattered and the fourth as a collision. A ray that leaves the centre at
// the same angle as its neighbours reads as one event.
//
// The lengths alternate long-short, which is the only irregularity in it. A
// burst with eight identical rays is a compass rose.
//
// Drawn rather than composed because antd has no illustration to compose
// from; every colour comes from the theme.

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type RepaidMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

/**
 * The burst: eight rays on an even 45°, alternating the brand's four colours
 * and two lengths. `INNER` clears the disc by 6, so nothing touches it.
 */
const INNER = 48;
const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

export function RepaidMark({ size = 148 }: RepaidMarkProps) {
  const { token } = theme.useToken();

  const colours = [brand.cyan, brand.orange, token.colorPrimary, brand.successMark];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {RAYS.map((angle, index) => {
        const rad = (angle * Math.PI) / 180;
        const outer = INNER + (index % 2 === 0 ? 9 : 6);
        return (
          <path
            key={angle}
            d={
              `M${60 + INNER * Math.cos(rad)} ${60 + INNER * Math.sin(rad)}` +
              `L${60 + outer * Math.cos(rad)} ${60 + outer * Math.sin(rad)}`
            }
            stroke={colours[index % colours.length]}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        );
      })}

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
