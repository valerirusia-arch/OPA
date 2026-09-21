// src/features/LoanApplication/ui/RepaidMark.tsx
//
// The illustration for a loan that has been repaid in full.
//
// Fourth of the family, and the first one where the sheet is CLOSED. The
// other three all show the same document at a turn of the epic — part-filled
// with a blue "+", shared with two people, handed in with a green tick — so
// this one shows it finished and stamped, tilted the other way from the
// submitted mark, as if it has been squared up and put on the pile.
//
//   ApplicationMark — part-filled sheet, blue "+"      → start one
//   InvitationMark  — sheet with two people            → join somebody's
//   SubmittedMark   — filled sheet, green check        → hand it in
//   RepaidMark      — closed sheet, sealed, a burst    → it is over
//
// THE CELEBRATION IS THE BURST AND NOTHING ELSE. *"რაღაც ფერად-ფერად რაღაცებს
// რომ ყრის ემოჯი, მაგის მსგავსი რაღაცა, ოღონდ ჩვენს სტილში."* Confetti in a
// product that has spent ten screens being careful about money would be a
// change of voice, so the burst is eight strokes in the brand's own three
// colours, radiating from the seal rather than raining over the card. It
// reads as a moment; it does not throw a party.
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

  /* Eight rays, alternating the brand's two accents and its green, at the
     angles of a compass rose. Written out rather than mapped: eight numbers
     in a list is shorter than the loop that would generate them. */
  const rays = [
    { d: "M60 6v9", c: brand.successMark },
    { d: "M98 22l-6 6", c: token.colorPrimary },
    { d: "M114 60h-9", c: brand.orange },
    { d: "M98 98l-6-6", c: brand.successMark },
    { d: "M60 114v-9", c: token.colorPrimary },
    { d: "M22 98l6-6", c: brand.orange },
    { d: "M6 60h9", c: brand.successMark },
    { d: "M22 22l6 6", c: token.colorPrimary },
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
      {rays.map((ray) => (
        <path
          key={ray.d}
          d={ray.d}
          stroke={ray.c}
          strokeWidth="3.4"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}

      {/* Green, because the news is good — the same ground the submitted mark
          stands on, so the two ends of the story share a colour. */}
      <circle cx="60" cy="60" r="44" fill={token.colorSuccessBg} />

      {/* Squared up and put down: the tilt is the other way from the submitted
          sheet, which is the difference between handing something in and
          being finished with it. */}
      <g transform="rotate(5 60 60)">
        <rect
          x="41"
          y="32"
          width="38"
          height="50"
          rx="6"
          fill={token.colorBgContainer}
          stroke={token.colorBorderSecondary}
        />
        <rect x="48" y="43" width="22" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="48" y="52" width="15" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="48" y="61" width="22" height="4" rx="2" fill={token.colorPrimary} />
      </g>

      {/* The seal: paid, and nothing owed. A tick rather than a zero, because
          the zero is on the balance card and this is the badge on the file. */}
      <circle
        cx="80"
        cy="82"
        r="15"
        fill={brand.successMark}
        stroke={token.colorBgContainer}
        strokeWidth="3"
      />
      <path
        d="M73.5 82.5l4.5 4.5 8.5-9"
        stroke={token.colorWhite}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default RepaidMark;
