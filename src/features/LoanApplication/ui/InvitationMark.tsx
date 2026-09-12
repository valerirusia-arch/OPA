// src/features/LoanApplication/ui/InvitationMark.tsx
//
// The illustration on a co-borrower's invitation.
//
// A tick in a tinted circle is the stock "success" mark, and nothing about
// this moment is a success: nobody has done anything yet. What has happened is
// that somebody's application now has a second place on it, and it is waiting
// for you — so the drawing is one document with two people on it, the first
// solid and the second still an outline.
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme, so it follows a token change like
// everything else.

import { theme } from "antd";

export type InvitationMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

/** A head and shoulders, drawn to fit a circle of radius `r` at (cx, cy). */
function Person({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g fill={color}>
      <circle cx={cx} cy={cy - 4} r="4.6" />
      <path
        d={`M${cx - 8} ${cy + 8.5}a8 8 0 0 1 16 0z`}
        // Clipped by the enclosing circle, so the shoulders read as a bust.
      />
    </g>
  );
}

export function InvitationMark({ size = 112 }: InvitationMarkProps) {
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
      <circle cx="60" cy="60" r="52" fill={token.colorPrimaryBg} />

      {/* The application — already begun, which is why it has writing on it. */}
      <rect
        x="36"
        y="24"
        width="48"
        height="52"
        rx="6"
        fill={token.colorBgContainer}
        stroke={token.colorBorderSecondary}
      />
      <rect x="44" y="36" width="26" height="4" rx="2" fill={token.colorPrimary} />
      <rect x="44" y="46" width="18" height="4" rx="2" fill={token.colorPrimary} />
      <rect x="44" y="56" width="26" height="4" rx="2" fill={token.colorFillSecondary} />

      {/* The borrower: on it already, filled in. */}
      <circle
        cx="49"
        cy="82"
        r="15"
        fill={token.colorPrimary}
        stroke={token.colorBgContainer}
        strokeWidth="3"
      />
      <clipPath id="opa-invite-a">
        <circle cx="49" cy="82" r="15" />
      </clipPath>
      <g clipPath="url(#opa-invite-a)">
        <Person cx={49} cy={82} color={token.colorWhite} />
      </g>

      {/* You: the place that is waiting, so it is an outline and not a fill. */}
      <circle
        cx="73"
        cy="82"
        r="15"
        fill={token.colorBgContainer}
        stroke={token.colorPrimary}
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <clipPath id="opa-invite-b">
        <circle cx="73" cy="82" r="14" />
      </clipPath>
      <g clipPath="url(#opa-invite-b)">
        <Person cx={73} cy={82} color={token.colorPrimary} />
      </g>
    </svg>
  );
}

export default InvitationMark;
