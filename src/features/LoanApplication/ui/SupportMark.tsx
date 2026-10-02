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
      {/* The bubble, with its tail down and to the left — away from the
          badge, so the two marks do not meet in the same corner. */}
      <path
        d="M54 44a14 14 0 0 1 14-14h58a14 14 0 0 1 14 14v40a14 14 0 0 1-14 14H88l-16 14v-14h-4a14 14 0 0 1-14-14V44Z"
        {...LINE}
        strokeLinejoin="round"
      />

      {/*
        THREE LINES, CENTRED IN THE BUBBLE.

        It had two, sitting in its upper half, which left the bottom-right
        empty for the badge to sit in — a bubble with a dent in it rather than
        a bubble with a badge on it. Three, centred on the body's own middle,
        fill it the way the packet's three fill the sheet, and the badge moves
        onto the corner instead of into the gap.

        Grey, like the inside of every document in the set, but SOLID where
        those are dashed. A dashed line inside a speech bubble says nothing is
        being said, which is the opposite of what this panel is for.
      */}
      {[
        { y: 48, w: 52 },
        { y: 62, w: 52 },
        { y: 76, w: 34 },
      ].map((line) => (
        <path
          key={line.y}
          d={`M70 ${line.y}h${line.w}`}
          stroke={brand.sceneSoft}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      ))}

      {/* The person answering, on the bubble's corner. */}
      <circle cx={134} cy={92} r={20} fill={brand.white} />
      <circle cx={134} cy={92} r={16} fill={brand.primary} />
      <circle cx={134} cy={87.5} r={4.6} fill={brand.white} />
      <path
        d="M126 101c0-4.8 3.6-8 8-8s8 3.2 8 8"
        fill="none"
        stroke={brand.white}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </SceneFrame>
  );
}

export default SupportMark;
