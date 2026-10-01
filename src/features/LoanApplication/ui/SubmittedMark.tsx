// src/features/LoanApplication/ui/SubmittedMark.tsx
//
// The illustration on the confirmation screen.
//
// A big green tick is the stock "done" mark, and done is not what happened.
// The application has been HANDED OVER: the borrower's part is finished, and
// somebody at OPA now has it. So the drawing is the same sheet of paper the
// rest of this epic uses — this time completely filled in, tilted as if it has
// just been put down on somebody's desk — with the tick demoted to a badge on
// the corner. The tick confirms receipt; it does not claim an outcome.
//
// Third of a family. The same document appears at every turn of the epic and
// changes only its badge, so the three moments read as one story:
//
//   InvitationMark  — sheet with two people            → join somebody's
//   SubmittedMark   — filled sheet, green check        → hand it in
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme.

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type SubmittedMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function SubmittedMark({ size = 112 }: SubmittedMarkProps) {
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
      {/* Green, because the news is good — but as a ground, not as a stamp. */}
      <circle cx="60" cy="60" r="52" fill={token.colorSuccessBg} />

      {/* Put down rather than held: the tilt is the whole story. */}
      <g transform="rotate(-6 60 58)">
        <rect
          x="40"
          y="28"
          width="42"
          height="56"
          rx="6"
          fill={token.colorBgContainer}
          stroke={token.colorBorderSecondary}
        />
        {/* Every line answered — nothing left blank, unlike the start mark. */}
        <rect x="48" y="40" width="24" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="48" y="50" width="17" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="48" y="60" width="24" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="48" y="70" width="13" height="4" rx="2" fill={token.colorPrimary} />
      </g>

      {/* Receipt, not verdict. */}
      <circle
        cx="82"
        cy="84"
        r="15"
        fill={brand.successMark}
        stroke={token.colorBgContainer}
        strokeWidth="3"
      />
      <path
        d="M75.5 84.5l4.5 4.5 8.5-9"
        stroke={token.colorWhite}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SubmittedMark;
