// src/features/LoanApplication/ui/SupportMark.tsx
//
// THE CONTACT PANEL'S DRAWING, redrawn in the product's one style.
//
// It was the last survivor of the old mark family — a speech bubble on a soft
// disc with a filled badge, built before the line-art set existed, so the
// contact page carried the only picture in the product that was drawn by a
// different hand. Same subject, same meaning, standing in `SceneFrame` with
// the rest: *"ესეც ჩვენს სტილზე უნდა დავსვათ."*
//
// COLOURED, like the application journey and unlike the empty states. The
// reasoning is the same one that split those two: an empty state is a place
// where nothing has happened and its picture must not compete with the way
// out, while this one sits beside a phone number somebody is looking for.
// Nothing on this panel is waiting to be filled in.
//
// Grey contour, teal contents, teal badge — the `act` register exactly, so
// the bubble and the application packet read as the same hand holding the
// same pen.

import { brand } from "../../../theme/tokens";
import { SceneFrame } from "../../../shared/ui/scenes/SceneFrame";

export type SupportMarkProps = {
  /** Rendered width in px. */
  size?: number;
};

const LINE = {
  stroke: brand.sceneLine,
  strokeWidth: 2.2,
  fill: brand.white,
} as const;

export function SupportMark({ size = 168 }: SupportMarkProps) {
  return (
    <SceneFrame width={size} blob={brand.sceneTealBlob} spark={brand.sceneTealSoft}>
      {/* The bubble, with its tail down and to the left — away from the badge,
          so the two marks do not meet in the same corner. */}
      <path
        d="M58 46a14 14 0 0 1 14-14h56a14 14 0 0 1 14 14v40a14 14 0 0 1-14 14H92l-16 14v-14h-4a14 14 0 0 1-14-14V46Z"
        {...LINE}
        strokeLinejoin="round"
      />

      {/* What is being said — grey, like the inside of every document in the
          set, but SOLID where those are dashed. A dashed line inside a speech
          bubble says nothing is being said, which is the opposite of what
          this panel is for: there is somebody on the other end of it. */}
      {[
        { y: 54, w: 46 },
        { y: 70, w: 30 },
      ].map((line) => (
        <path
          key={line.y}
          d={`M76 ${line.y}h${line.w}`}
          stroke={brand.sceneSoft}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      ))}

      {/* The person answering, ringed in white and in the badge's own slot. */}
      <circle cx={138} cy={96} r={20} fill={brand.white} />
      <circle cx={138} cy={96} r={16} fill={brand.primary} />
      <circle cx={138} cy={91.5} r={4.6} fill={brand.white} />
      <path
        d="M130 105c0-4.8 3.6-8 8-8s8 3.2 8 8"
        fill="none"
        stroke={brand.white}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </SceneFrame>
  );
}

export default SupportMark;
