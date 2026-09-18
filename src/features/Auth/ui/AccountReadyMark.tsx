// src/features/Auth/ui/AccountReadyMark.tsx
//
// The illustration on the last step of registration.
//
// It was a green circle with a tick in it — the stock "done" mark, the one
// every form in the world ends with. It says an operation succeeded. What
// actually happened here is that this person now HAS something: an account,
// with their email on it, that they will sign in to.
//
// So the drawing is that account. A card with a person on it and their details
// beside them, tilted as if it has just been handed over, with the tick
// demoted to a badge on the corner. The tick confirms; the card is the news.
//
// Built to the same rules as the loan application's marks (ApplicationMark,
// InvitationMark, SubmittedMark), so the two epics look like one product:
// a soft circular ground, one tilted object, a badge at the lower right in the
// same place and the same size, and every colour from the theme.
//
//   AccountReadyMark — a card with a person       → you have an account
//   ApplicationMark  — part-filled sheet, blue +  → start an application
//   InvitationMark   — sheet with two people      → join somebody's
//   SubmittedMark    — filled sheet, green check  → hand it in
//
// Drawn rather than composed because antd has no illustration to compose from.

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type AccountReadyMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function AccountReadyMark({ size = 112 }: AccountReadyMarkProps) {
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
      {/* The product's own colour, as a ground. Green is saved for the badge,
          where it means "confirmed" rather than "this screen is green". */}
      <circle cx="60" cy="60" r="52" fill={token.colorPrimaryBg} />

      {/* Handed over rather than filed: the tilt is why it reads as an object
          and not as a diagram. The same -6° the submitted sheet uses. */}
      <g transform="rotate(-6 60 60)">
        <rect
          x="28"
          y="38"
          width="64"
          height="44"
          rx="8"
          fill={token.colorBgContainer}
          stroke={token.colorBorderSecondary}
        />

        {/* The person: a head and shoulders, the way an ID card carries one. */}
        <circle cx="47" cy="55" r="7" fill={token.colorPrimary} />
        <path
          d="M37 71c0-5.5 4.5-10 10-10s10 4.5 10 10"
          fill={token.colorPrimary}
        />

        {/* Their details beside them. Two lines, because a name and an email
            is what an account is; more would be a form, not a card. */}
        <rect x="64" y="51" width="20" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="64" y="60" width="14" height="4" rx="2" fill={token.colorFill} />
      </g>

      {/* Confirmed, in the badge's slot — same centre, radius and ring as the
          submitted mark's, so the family is literal and not just similar. */}
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

export default AccountReadyMark;
