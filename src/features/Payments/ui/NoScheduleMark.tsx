// src/features/Payments/ui/NoScheduleMark.tsx
//
// The illustration for a payments page with nothing to repay.
//
// The subject of this page is the SCHEDULE — a list of dated instalments — so
// the drawing is that list, with the dates in place and the amounts not filled
// in yet. The WBS is the reason it can be drawn as "not yet" rather than as
// "none": "Repayment Schedule is automatically generated when the loan is
// funded", so the rows are coming, they are simply not here.
//
// Third in the family, and it follows the same rules as the other two
// (`ApplicationMark`, `NoLoanMark`): a soft disc, the product's own dot motif
// around it, one object drawn in the page's white with a dashed edge where the
// thing is missing, and one badge in the corner saying which kind of absence
// this is. A blue clock — waiting, not refused.
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme.

import { theme } from "antd";

export type NoScheduleMarkProps = {
  /** Rendered square. The artwork scales from a 200-unit viewBox. */
  size?: number;
  /**
   * Drawn in neutrals rather than in the accent.
   *
   * A page-sized empty state earns the blue: it is the only thing on the
   * screen and its badge points at the one way forward. A placeholder inside
   * a half-width panel does not — two accented drawings side by side compete
   * with the page's actual primary action, and the designer's call was that
   * they should not. *"აქ ლურჯი ფერები აღარ გვინდა."*
   */
  muted?: boolean;
};

export function NoScheduleMark({ size = 176, muted = false }: NoScheduleMarkProps) {
  const { token } = theme.useToken();

  /** The drawing's accent, or its quiet stand-in. */
  const accent = muted ? token.colorTextQuaternary : token.colorPrimary;
  const accentBg = muted ? token.colorFillQuaternary : token.colorPrimaryBg;
  const accentEdge = muted ? token.colorFill : token.colorPrimaryBorder;

  /** The three instalment rows: y, and how wide the date beside it runs. */
  const rows = [
    { y: 92, date: 40 },
    { y: 116, date: 34 },
    { y: 140, date: 44 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* The ground: one soft disc, off centre, so the sheet sits IN
          something rather than on a plate. */}
      <circle cx="104" cy="96" r="72" fill={accentBg} />

      {/* The dot motif the other two marks use, so the three read as a set. */}
      <circle cx="42" cy="52" r="4" fill={token.colorFill} />
      <circle cx="168" cy="58" r="6" fill={accentEdge} />
      <circle cx="176" cy="128" r="3.5" fill={token.colorFill} />
      <circle cx="34" cy="130" r="5" fill={token.colorFillSecondary} />

      {/* The schedule itself. */}
      <rect
        x="46"
        y="46"
        width="108"
        height="118"
        rx="12"
        fill={token.colorBgContainer}
        stroke={token.colorBorderSecondary}
        strokeWidth="2"
      />

      {/* Its head: the month the schedule starts in, as a bar. */}
      <rect x="62" y="62" width="46" height="8" rx="4" fill={accent} />

      {/* A rule under the head, the way a table has one. */}
      <path d="M46 80h108" stroke={token.colorBorderSecondary} strokeWidth="2" />

      {/* Three rows: the due date on the left, and where the amount will go —
          dashed, because the figures are what does not exist yet. */}
      {rows.map((row) => (
        <g key={row.y}>
          <rect
            x="62"
            y={row.y}
            width={row.date}
            height="6"
            rx="3"
            fill={token.colorFillSecondary}
          />
          <rect
            x="112"
            y={row.y - 4}
            width="26"
            height="14"
            rx="4"
            fill={token.colorBgContainer}
            stroke={token.colorBorder}
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
        </g>
      ))}

      {/* Waiting, not refused: the schedule arrives when the money does. */}
      <circle
        cx="150"
        cy="150"
        r="22"
        fill={accent}
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

export default NoScheduleMark;
