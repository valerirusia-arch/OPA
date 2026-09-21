// src/features/LoanApplication/ui/RepaidMark.tsx
//
// The illustration for a loan that has been repaid in full — a party popper.
//
// IT BREAKS THE FAMILY ON PURPOSE. The other three marks in this epic are the
// same sheet of paper at three turns of the story: part-filled with a blue
// "+", shared with two people, handed in with a green tick. The first draft of
// this one followed them — the sheet again, closed and sealed — and the
// designer's answer was that it is not what the moment is:
// *"ეს ილუსტრაცია არ მომწონს, დაახლოებით მსგვასი რაღაც მინდა"* against the
// party-popper emoji. They are right, and the reason is worth writing down:
// the other three are about the APPLICATION, which is a document. This one is
// about the borrower, who has finished paying — the document has nothing more
// to say, and drawing it again would be the fourth picture of a form on the
// one screen that is not about a form.
//
// SO IT IS THE EMOJI'S IDEA IN THIS PRODUCT'S HAND. A cone, streamers and
// confetti, but flat, geometric and in the brand's own four colours rather
// than the emoji's gold and magenta — the same restraint every other drawing
// here is built with. It reads as a moment; it does not throw a party.
//
// Drawn rather than composed because antd has no illustration to compose
// from; every colour comes from the theme.

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type RepaidMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function RepaidMark({ size = 112 }: RepaidMarkProps) {
  const { token } = theme.useToken();

  /* The confetti, as four colours over eight pieces. Written out rather than
     generated: eight positions chosen to sit in the gaps between the
     streamers is not something a loop knows how to do. */
  const bits = [
    { x: 84, y: 20, r: 18, c: token.colorPrimary },
    { x: 98, y: 38, r: -24, c: brand.orange },
    { x: 70, y: 14, r: -12, c: brand.successMark },
    { x: 104, y: 60, r: 36, c: brand.cyan },
    { x: 56, y: 24, r: 44, c: brand.orange },
    { x: 92, y: 76, r: -8, c: token.colorPrimary },
    { x: 46, y: 16, r: 22, c: brand.cyan },
    { x: 108, y: 22, r: -30, c: brand.successMark },
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
      {/* The soft ground the whole family stands on, so this mark still
          belongs to the set it is deliberately unlike. */}
      <circle cx="60" cy="60" r="46" fill={token.colorSuccessBg} />

      {/* TWO STREAMERS, curling out of the cone's mouth. Strokes rather than
          ribbons: a filled ribbon at this size turns into a blob. */}
      <path
        d="M62 54c10-8 14 2 22-4s6-12 14-14"
        stroke={brand.cyan}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M66 66c12-2 12 8 22 6s10-10 18-8"
        stroke={brand.successMark}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* THE CONE, tip at the bottom left and the mouth opening up and to the
          right — the emoji's own angle, which is what makes a triangle read
          as a popper rather than as an arrow. */}
      <path d="M24 98L60 46l22 22z" fill={brand.orange} />
      {/* Two bands across it. The emoji stripes its cone; one colour would be
          a paper hat. */}
      <path d="M40 76l22-22 6 6-22 22z" fill={brand.orangeSoft} opacity="0.9" />
      <path d="M31 89l22-22 4 4-22 22z" fill={brand.orangeSoft} opacity="0.55" />
      {/* The mouth, as the ellipse the cone is cut on. */}
      <ellipse
        cx="71"
        cy="57"
        rx="8"
        ry="15"
        transform="rotate(45 71 57)"
        fill={brand.orangeSoft}
      />

      {/* THE CONFETTI. Squares, because a square at 6px still has corners and
          a circle at 6px is a dot. */}
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

export default RepaidMark;
