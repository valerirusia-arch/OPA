// src/features/Payments/ui/RepaidTrackMark.tsx
//
// A loan repaid in full, drawn in the product's own language.
//
// THE PARTY POPPER WAS A BORROWED IDEA and it read as one: a cone and some
// confetti belong to a chat app, not to a lender whose borrower has just
// spent twelve months making payments. *"ეს ილუსტრაცია არ მომწონს, მოდი
// შენით მოიფიქრე, რამე ისეთი მინდა აღნიშვნის."*
//
// So this is the one picture this product has been drawing all along. The
// instalment track — twelve capsules, the paid ones filled — has been on the
// dashboard, on /loan and on /payments since Epic 6, and a borrower has
// watched it fill one payment at a time. CLOSED INTO A RING AND ALL TWELVE
// GREEN, it is the same drawing at its end: not a symbol OF the achievement,
// the achievement itself. Nothing else in the product could mean this.
//
// The tick in the middle is the only borrowed part, and it is there because a
// ring of twelve on its own is a picture of twelve things rather than of
// being finished. The four squares outside are the celebration, and four is
// as far as it goes: this is a moment, not a party.
//
// Drawn rather than composed because antd has no illustration to compose
// from; every colour comes from the theme.

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type RepaidTrackMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

/** The ring the twelve capsules sit on. */
const R = 40;
const CIRCUMFERENCE = 2 * Math.PI * R;
/** One instalment's share of the ring, and the capsule drawn inside it. */
const SLOT = CIRCUMFERENCE / 12;
const CAP = SLOT * 0.62;

export function RepaidTrackMark({ size = 148 }: RepaidTrackMarkProps) {
  const { token } = theme.useToken();

  /* Four pieces, in the brand's own colours, sitting in the gaps the ring
     leaves at its corners. Written out rather than generated: four positions
     chosen not to collide with the ring is not something a loop knows. */
  const bits = [
    { x: 14, y: 22, r: 18, c: brand.cyan },
    { x: 98, y: 16, r: -22, c: brand.orange },
    { x: 104, y: 92, r: 12, c: token.colorPrimary },
    { x: 18, y: 96, r: -14, c: brand.successMark },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* The ground the whole family of empty states stands on. */}
      <circle cx="60" cy="60" r="44" fill={token.colorSuccessBg} />

      {/* TWELVE CAPSULES, ALL PAID. One circle with a dash pattern rather than
          twelve paths: the pattern IS the fact — a circumference divided by
          twelve — so the drawing cannot drift out of step with the schedule
          it stands for. */}
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke={brand.successMark}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${CAP} ${SLOT - CAP}`}
        transform="rotate(-90 60 60)"
      />

      {/* Finished, not just twelve. */}
      <path
        d="M47 60.5l9 9 18-19"
        stroke={brand.success}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {bits.map((bit) => (
        <rect
          key={`${bit.x}-${bit.y}`}
          x={bit.x}
          y={bit.y}
          width="7"
          height="7"
          rx="1.5"
          fill={bit.c}
          transform={`rotate(${bit.r} ${bit.x + 3.5} ${bit.y + 3.5})`}
        />
      ))}
    </svg>
  );
}

export default RepaidTrackMark;
