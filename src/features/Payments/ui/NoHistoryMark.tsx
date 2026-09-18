// src/features/Payments/ui/NoHistoryMark.tsx
//
// The illustration for a payment history with nothing in it yet.
//
// The subject is a list of PAYMENT ATTEMPTS — "every attempt appears here,
// whether it went through or not" — so the drawing is a receipt: a slip with a
// couple of rows and the amounts not filled in, the figures being exactly what
// has not happened yet. A clock badge, waiting: the attempts are coming, none
// has been made.
//
// Fourth in the family (`ApplicationMark`, `NoLoanMark`, `NoScheduleMark`),
// same recipe: a soft disc, the product's dot motif around it, one object in
// the page's white with a dashed edge where the missing thing goes, and one
// badge in the corner. GREY, NOT BLUE — *"ფერი ნაცრისფერი დატოვე."* This one
// sits inside a table card, not on a page of its own, so it does not earn the
// accent the way a page-sized empty state does; it stays in the neutrals the
// other marks fall back to under `muted`.
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme.

import { theme } from "antd";

export type NoHistoryMarkProps = {
  /** Rendered square. The artwork scales from a 200-unit viewBox. */
  size?: number;
};

export function NoHistoryMark({ size = 148 }: NoHistoryMarkProps) {
  const { token } = theme.useToken();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* The ground: one soft disc, off centre, so the slip sits IN something
          rather than on a plate. */}
      <circle cx="104" cy="96" r="72" fill={token.colorFillQuaternary} />

      {/* The dot motif the other marks use, so the set reads as one family. */}
      <circle cx="42" cy="52" r="4" fill={token.colorFill} />
      <circle cx="168" cy="58" r="6" fill={token.colorFill} />
      <circle cx="176" cy="128" r="3.5" fill={token.colorFill} />
      <circle cx="34" cy="130" r="5" fill={token.colorFillSecondary} />

      {/* The receipt: rounded at the top, torn along the bottom. */}
      <path
        d="M56 60 Q56 48 68 48 H132 Q144 48 144 60 V150
           l-8.8 8 l-8.8 -8 l-8.8 8 l-8.8 -8 l-8.8 8
           l-8.8 -8 l-8.8 8 l-8.8 -8 l-8.8 8 l-8.8 -8 V60 Z"
        fill={token.colorBgContainer}
        stroke={token.colorBorderSecondary}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* The merchant line at the head, and a rule under it the way a slip
          prints one. */}
      <rect x="70" y="66" width="40" height="8" rx="4" fill={token.colorTextQuaternary} />
      <path d="M62 84H138" stroke={token.colorBorderSecondary} strokeWidth="2" />

      {/* Two lines: a label on the left, and where the amount would print —
          dashed, because the figures are exactly what has not happened yet. */}
      {[98, 122].map((y, i) => (
        <g key={y}>
          <rect
            x="70"
            y={y}
            width={i === 0 ? 30 : 24}
            height="6"
            rx="3"
            fill={token.colorFillSecondary}
          />
          <rect
            x="112"
            y={y - 4}
            width="24"
            height="14"
            rx="4"
            fill={token.colorBgContainer}
            stroke={token.colorBorder}
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
        </g>
      ))}

      {/* Waiting, not refused: the attempts are coming, none has been made.
          Ringed in the page's own white so it sits on top of the slip. */}
      <circle
        cx="150"
        cy="150"
        r="22"
        fill={token.colorTextQuaternary}
        stroke={token.colorBgContainer}
        strokeWidth="4"
      />
      <path
        d="M150 140v10.5l6.5 4"
        stroke={token.colorWhite}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default NoHistoryMark;
