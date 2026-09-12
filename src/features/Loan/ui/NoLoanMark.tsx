// src/features/Loan/ui/NoLoanMark.tsx
//
// The illustration for a loan page with no loan on it.
//
// The page's subject is a loan and the virtual card it issues, so the drawing
// is that card — as an EMPTY SLOT, with the card that would have filled it
// tucked behind. A dashed outline says "nothing has been issued" in a way a
// crossed-out card or a sad face cannot: it is not a failure, it is a space
// with nothing in it yet.
//
// A SCENE, NOT A GLYPH. It was a 112px badge on a circle and the designer's
// verdict was that antd's own 403 artwork is more interesting — and it is,
// because it has depth, a ground and things going on around the subject.
// antd only ships those for 403/404/500 and a "page not found" drawing on a
// cancelled loan would be saying the wrong thing, so this one grew instead:
// a tilted card behind the slot, a soft ground, and the product's dot motif
// scattered around it. Same family as the document marks, one register up.
//
// ONE STATE. It used to carry a second, greyed-out variant for a cancelled
// loan, drawn with a bar in the badge instead of a "+". The page no longer
// distinguishes the two — cancelling leaves exactly the empty page somebody
// who never applied sees — so the variant had no reader and is gone with it.
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme.

import { theme } from "antd";

export type NoLoanMarkProps = {
  /** Rendered square. The artwork scales from a 200-unit viewBox. */
  size?: number;
  /**
   * Drawn in neutrals rather than in the accent.
   *
   * The designer's call across all three of the dashboard's empty frames:
   * *"ესეც ნაცრისფერი ხომ არ ვქნათ."* An empty state is a place where
   * nothing has happened yet, and an accent on it competes with the one
   * button that is the actual way forward — which on that page sits directly
   * underneath this drawing.
   */
  muted?: boolean;
};

export function NoLoanMark({ size = 176, muted = false }: NoLoanMarkProps) {
  const { token } = theme.useToken();

  /** The drawing's accent, or its quiet stand-in. */
  const accent = muted ? token.colorTextQuaternary : token.colorPrimary;
  const accentBg = muted ? token.colorFillQuaternary : token.colorPrimaryBg;
  const accentEdge = muted ? token.colorFill : token.colorPrimaryBorder;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* The ground: one soft disc, off centre, so the scene sits IN
          something rather than on a plate. */}
      <circle
        cx="104"
        cy="96"
        r="72"
        fill={accentBg}
      />

      {/* The dot motif, the same one the auth pages' ground uses: a few marks
          at different weights, to give the disc some air around the card. */}
      <circle cx="42" cy="52" r="4" fill={token.colorFill} />
      <circle cx="168" cy="60" r="6" fill={accentEdge} />
      <circle cx="176" cy="130" r="3.5" fill={token.colorFill} />
      <circle cx="34" cy="132" r="5" fill={token.colorFillSecondary} />
      <path
        d="M150 34h12M156 28v12"
        stroke={token.colorFill}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* The card that is not there, tilted behind: depth, and the reason the
          slot in front reads as a slot. */}
      <g transform="rotate(-9 100 100)">
        <rect
          x="52"
          y="58"
          width="96"
          height="60"
          rx="10"
          fill={token.colorBgContainer}
          stroke={token.colorBorderSecondary}
          strokeWidth="2"
        />
        <rect x="64" y="72" width="18" height="13" rx="3" fill={token.colorFillSecondary} />
      </g>

      {/* The slot itself, square to the frame and in front. */}
      <rect
        x="46"
        y="86"
        width="112"
        height="70"
        rx="12"
        fill={token.colorBgContainer}
        stroke={token.colorBorder}
        strokeWidth="2.5"
        strokeDasharray="10 8"
      />

      {/* Chip and number line — the two marks that make a rectangle read as a
          card without a logo on it. Placeholder weight, not type weight. */}
      <rect x="62" y="104" width="20" height="15" rx="4" fill={token.colorFillSecondary} />
      <rect x="62" y="130" width="58" height="7" rx="3.5" fill={token.colorFill} />
      <rect x="128" y="130" width="14" height="7" rx="3.5" fill={token.colorFillSecondary} />

      {/* The badge. Ringed in the page's own white so it reads as sitting on
          top of the card rather than punched out of it. */}
      <circle
        cx="150"
        cy="150"
        r="22"
        fill={accent}
        stroke={token.colorBgContainer}
        strokeWidth="4"
      />
      <path
        d="M150 140v20M140 150h20"
        stroke={token.colorWhite}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default NoLoanMark;
