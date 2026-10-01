// src/features/Auth/ui/IdentityVerifiedMark.tsx
//
// The illustration on the identity step, once InstantID comes back clean.
//
// A photo ID with a magnifier held over it, because that is literally the
// story: the details this person typed were LOOKED AT against records, and
// they matched. Not "an operation succeeded" — somebody checked.
//
// It was tried as a fingerprint first. Four concentric arcs open at the bottom
// do not read as a print at 112px; they read as a rainbow, or as a wifi
// symbol. A print needs irregular ridges and a whorl to be recognisable, and
// that is detail this size cannot hold.
//
// The magnifier's lens IS the family's badge — same centre, same radius, same
// ring, same white check. It only grows a handle, so the geometry every other
// mark shares is intact while the silhouette is unlike any of them. The card
// stands portrait with a photo panel, which is what keeps it from being read
// as AccountReadyMark's landscape account card two steps later.
//
//   IdentityVerifiedMark — a photo ID under a magnifier → checked, and it's you
//   AccountReadyMark     — a card with a person         → you have an account
//   InvitationMark       — sheet with two people        → join somebody's
//   SubmittedMark        — filled sheet, green check    → hand it in

import { theme } from "antd";
import { brand } from "../../../theme/tokens";

export type IdentityVerifiedMarkProps = {
  /** Rendered square. The artwork scales from a 120-unit viewBox. */
  size?: number;
};

export function IdentityVerifiedMark({ size = 112 }: IdentityVerifiedMarkProps) {
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
      {/* The product's colour as a ground. Green is saved for the lens, where
          it means "confirmed" rather than "this screen is green". */}
      <circle cx="60" cy="60" r="52" fill={token.colorPrimaryBg} />

      {/* The document, standing portrait and set slightly left, so the
          magnifier has somewhere to be without covering the face. */}
      <g transform="rotate(-6 56 58)">
        {/* Sized to leave a ring of ground all round it. At 48x62 it filled
            the circle and the ground stopped reading as a ground. */}
        <rect
          x="35"
          y="32"
          width="42"
          height="53"
          rx="7"
          fill={token.colorBgContainer}
          stroke={token.colorBorderSecondary}
        />

        {/* The photo panel: head and shoulders in a frame, the way an ID
            carries them. */}
        <rect x="43" y="40" width="21" height="23" rx="4" fill={token.colorPrimaryBg} />
        <circle cx="53.5" cy="48" r="4.4" fill={token.colorPrimary} />
        <path d="M46.5 59.5c0-3.9 3.1-7 7-7s7 3.1 7 7" fill={token.colorPrimary} />

        {/* The details under the photo. */}
        <rect x="43" y="70" width="26" height="4" rx="2" fill={token.colorPrimary} />
        <rect x="43" y="77.5" width="16" height="4" rx="2" fill={token.colorFill} />
      </g>

      {/* The handle, drawn first so the lens sits on top of it. */}
      <path
        d="M92 94l10 10"
        stroke={brand.successMark}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* The lens, which is the family's badge with a handle on it: same
          centre, radius, ring and check as every other mark's. */}
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

export default IdentityVerifiedMark;
