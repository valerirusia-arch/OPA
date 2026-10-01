// src/features/LoanApplication/ui/SupportMark.tsx
//
// The illustration on the contact page. Epic 3, WBS story 8.
//
// It draws what the page promises without a sentence saying so: a message,
// with a person behind it. Not a headset, which says call centre; not a
// speech bubble alone, which says chat, a thing this product deliberately
// does not have. It sits in the Call panel, whose whole claim is that there
// is somebody on the end of the number.
//
// Built to the family's own grammar rather than invented beside it: the 120
// viewBox, the soft primary ground at r52, one object in the container colour
// with a hairline stroke, and the badge in the slot every other mark uses —
// cx 82, cy 84, r 15, with a 3px ring so it sits ON the object instead of
// beside it. Same as InvitationMark and SubmittedMark, so
// this reads as the fourth of a set and not as a stray picture.
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme, so it follows a token change like
// everything else.

import { theme } from "antd";

export type SupportMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function SupportMark({ size = 112 }: SupportMarkProps) {
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

      {/*
        The message. A rounded panel with a tail on the lower left, so the
        bubble points back toward the reader rather than off the mark.
      */}
      <path
        d="M32 26h56a8 8 0 0 1 8 8v34a8 8 0 0 1-8 8H52l-12 11V76h-8a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8z"
        fill={token.colorBgContainer}
        stroke={token.colorBorderSecondary}
      />

      {/* What is written in it. Two lines, the way the application mark and the
          invitation mark both carry their content: the top line is the ask,
          the shorter one under it the reply. */}
      <rect x="42" y="40" width="36" height="4" rx="2" fill={token.colorPrimary} />
      <rect x="42" y="52" width="22" height="4" rx="2" fill={token.colorFillSecondary} />

      {/* The person who answers, in the family's badge slot. */}
      <circle
        cx="82"
        cy="84"
        r="15"
        fill={token.colorPrimary}
        stroke={token.colorBgContainer}
        strokeWidth="3"
      />
      <clipPath id="opa-support-badge">
        <circle cx="82" cy="84" r="15" />
      </clipPath>
      <g clipPath="url(#opa-support-badge)" fill={token.colorWhite}>
        <circle cx="82" cy="80" r="4.6" />
        {/* Clipped by the badge, so the shoulders read as a bust. */}
        <path d="M74 92.5a8 8 0 0 1 16 0z" />
      </g>
    </svg>
  );
}

export default SupportMark;
