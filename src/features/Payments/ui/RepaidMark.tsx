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
// AND CONFETTI AROUND IT — *"ალაგ-ალაგ ოთხკუთხედები, პატარა."* Eight rays
// on an even 45° were tried in between and read as a compass rose or a sun,
// which is the failure mode of regularity: a burst has to look thrown.
//
// So: ten small squares on a ring outside the disc, and the ring is the only
// regular thing about them. Every one differs in radius, size and rotation,
// and the angles are near-even with a few degrees of drift — enough that no
// two read as a pair, not so much that one side of the mark ends up empty.
// The first attempt at this failed the other way: four squares placed by
// hand, three of which clumped and one of which collided with the disc.
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
 * The confetti: ten squares on a ring outside the disc.
 *
 * `a` is the angle in degrees, `r` how far out, `w` the square's side and `t`
 * its own tilt. Written out rather than generated, because what makes this
 * read as thrown is precisely that the numbers are not a formula — a loop
 * would give it the even spacing that made the last version a sun.
 */
const BITS = [
  { a: -84, r: 52, w: 5.5, t: 18 },
  { a: -48, r: 57, w: 4, t: -22 },
  { a: -14, r: 51, w: 5, t: 34 },
  { a: 22, r: 56, w: 4.5, t: -10 },
  { a: 56, r: 50, w: 4, t: 26 },
  { a: 92, r: 55, w: 5.5, t: -30 },
  { a: 128, r: 51, w: 4.5, t: 14 },
  { a: 160, r: 57, w: 4, t: -18 },
  { a: 196, r: 50, w: 5, t: 30 },
  { a: 232, r: 55, w: 4.5, t: -26 },
];

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
      {BITS.map((bit, index) => {
        const rad = (bit.a * Math.PI) / 180;
        const x = 60 + bit.r * Math.cos(rad) - bit.w / 2;
        const y = 60 + bit.r * Math.sin(rad) - bit.w / 2;
        return (
          <rect
            key={bit.a}
            x={x}
            y={y}
            width={bit.w}
            height={bit.w}
            rx="1.2"
            fill={colours[index % colours.length]}
            transform={`rotate(${bit.t} ${x + bit.w / 2} ${y + bit.w / 2})`}
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
