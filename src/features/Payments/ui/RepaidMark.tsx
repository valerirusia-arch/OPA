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
// And they are NOT on a ring. Putting them on one with a few degrees of drift
// was the second version of the same mistake: equal distances read as a dial
// however much the angles wander. *"პროსტა რენდომ ადგილები მიუჩინე, მიმოფანტე
// გვერდებზე ცოტა."*
//
// So each square has a position of its own, from 46 to 55 out, with the wider
// throws to the left and right where a square box has room and the shorter
// ones above and below where it does not. The first attempt failed the other
// way — four squares placed by hand, three clumped and one colliding with the
// disc — so the one rule kept is that nothing may land inside r=45.
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
 * The confetti: ten squares, each placed rather than spaced.
 *
 * `x`/`y` are the square's own top-left in the 120 viewBox, `w` its side and
 * `t` its tilt. Written as coordinates and not as angles, because an angle
 * and a radius is how the last two versions ended up a sun and a dial: the
 * scatter has to be in the numbers, and polar coordinates keep taking it out.
 *
 * Every one of these sits at least 46 from the centre, clear of the disc at
 * 42, and the ones thrown furthest are to the left and right, where a square
 * box has the room a circle does not.
 */
const BITS = [
  { x: 52, y: 6, w: 5.5, t: 18 },
  { x: 30, y: 20, w: 4, t: -22 },
  { x: 84, y: 16, w: 4.5, t: 34 },
  { x: 12, y: 46, w: 5, t: -12 },
  { x: 100, y: 38, w: 4, t: 26 },
  { x: 6, y: 74, w: 4.5, t: -30 },
  { x: 108, y: 66, w: 5.5, t: 14 },
  { x: 24, y: 96, w: 4, t: -18 },
  { x: 92, y: 100, w: 5, t: 30 },
  { x: 58, y: 108, w: 4.5, t: -26 },
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
      {BITS.map((bit, index) => (
        <rect
          key={`${bit.x}-${bit.y}`}
          x={bit.x}
          y={bit.y}
          width={bit.w}
          height={bit.w}
          rx="1.2"
          fill={colours[index % colours.length]}
          transform={`rotate(${bit.t} ${bit.x + bit.w / 2} ${bit.y + bit.w / 2})`}
        />
      ))}

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
