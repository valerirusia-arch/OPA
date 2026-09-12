// src/features/LoanApplication/ui/ApplicationMark.tsx
//
// The illustration that opens a loan application.
//
// A stock file-with-a-plus icon in a tinted circle is what every empty state
// in every product looks like, and it says nothing about this one. What a
// borrower is actually starting here is a PACKET — a USCIS filing with a
// funding request attached — so the mark is a small stack of paper with the
// top sheet part filled in and a badge to add another.
//
// ONE DRAWING, FIVE BADGES. Every state of the Application page is something
// that has happened to the SAME packet — it is waiting, it needs one more
// thing, it cannot go on — so the paper never changes and only the badge and
// the tint behind it do. Four of those states used to be a 56px antd icon in
// a grey avatar, which made half the page's states look like a different
// product from the other half: *"ეს აიქონი არ მინდა, უბრალოდ რამე საინტერესო
// ილუსტრაცია გააკეთე ჩვენს სტილში."*
//
//   add       blue "+"        start one
//   waiting   blue clock      one is already with OPA
//   more      amber "!"       somebody has asked for something
//   paused    amber pause     a check did not answer; NOT a refusal
//   blocked   red bar         this cannot go on
//
// Drawn rather than composed because antd has no illustration to compose from;
// every colour comes from the theme, so it follows a token change like
// everything else. This is the exception §2 allows, not a licence to draw the
// next thing too.

import { theme } from "antd";

/** What has happened to the packet. See the note above. */
export type ApplicationMarkBadge = "add" | "waiting" | "more" | "paused" | "blocked";

export type ApplicationMarkProps = {
  badge?: ApplicationMarkBadge;
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

  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function ApplicationMark({
  badge = "add",
  muted = false,
  size = 140,
}: ApplicationMarkProps) {
  const { token } = theme.useToken();

  /* The badge's colour and the halo behind the paper are one decision: a
     refusal must not sit on the same tint as an invitation. */
  const tone = muted
    ? { ground: token.colorFillQuaternary, badge: token.colorTextQuaternary }
    : badge === "blocked"
      ? { ground: token.colorErrorBg, badge: token.colorError }
      : badge === "more" || badge === "paused"
        ? { ground: token.colorWarningBg, badge: token.colorWarning }
        : { ground: token.colorPrimaryBg, badge: token.colorPrimary };

  /* Every glyph is drawn on the same 12-unit grid around the badge's centre,
     so they all sit at the same optical weight. */
  const glyph = {
    add: "M77 86h12M83 80v12",
    waiting: "M83 79.5v7l4.5 3",
    more: "M83 79.5v7.5",
    paused: "M79.5 80.5v11M86.5 80.5v11",
    blocked: "M77 86h12",
  }[badge];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* The halo the sheets sit on, in the badge's own tone. Wide enough
          that it reads as a circle rather than as a rounded box glimpsed at
          the corners of the paper. */}
      <circle cx="60" cy="60" r="52" fill={tone.ground} />

      {/* The sheet behind, tilted just enough to read as a second one. */}
      <g transform="rotate(-12 60 60)">
        <rect
          x="42"
          y="30"
          width="38"
          height="56"
          rx="6"
          fill={token.colorBgContainer}
          stroke={token.colorBorderSecondary}
        />
      </g>

      {/* The sheet you are filling in. */}
      <rect
        x="42"
        y="32"
        width="38"
        height="56"
        rx="6"
        fill={token.colorBgContainer}
        stroke={token.colorBorderSecondary}
      />

      {/* Two answered lines and one still blank — the state the screen is
          inviting you to change. The answered ones take the badge's colour,
          so the whole drawing agrees with itself. */}
      <rect x="50" y="44" width="22" height="4" rx="2" fill={tone.badge} />
      <rect x="50" y="54" width="15" height="4" rx="2" fill={tone.badge} />
      <rect x="50" y="64" width="22" height="4" rx="2" fill={token.colorFillSecondary} />
      <rect x="50" y="74" width="10" height="4" rx="2" fill={token.colorFillSecondary} />

      {/* The badge. The ring is the page's own background, so it reads as
          sitting in front of the paper rather than punched through it. */}
      <circle
        cx="83"
        cy="86"
        r="14"
        fill={tone.badge}
        stroke={token.colorBgContainer}
        strokeWidth="3"
      />
      <path
        d={glyph}
        stroke={token.colorWhite}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* The dot under the "!". Drawn rather than stroked, because a
          round-capped 1px line reads as a smudge at this size. */}
      {badge === "more" ? <circle cx="83" cy="91.5" r="1.6" fill={token.colorWhite} /> : null}
    </svg>
  );
}

export default ApplicationMark;
