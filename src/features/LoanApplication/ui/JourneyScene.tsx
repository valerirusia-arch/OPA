// src/features/LoanApplication/ui/JourneyScene.tsx
//
// THE APPLICATION JOURNEY'S DRAWINGS — the same hand as the empty states, in
// colour.
//
// WHY THESE ARE ALLOWED COLOUR AND THE EMPTIES ARE NOT. An empty state is a
// place where nothing has happened, and an accent on it competes with the one
// button that is the way forward — so those are grey, at hairline weight, as
// quiet as a drawing can be. The gate is the opposite case: every state here
// is a journey somebody is ON, with something already filed or about to be,
// and the picture is carrying the page rather than apologising for it.
// *"აქ უნდა იყოს ფერადები იგივე სტილში, იმიტომ რომ ეს უფრო ილუსტრაციაში
// გაგვყავს და არა ემფთი სფეისში."*
//
// TEAL, NOT THE CTA ORANGE. The orange button sits directly under this
// drawing, and an illustration in the colour of the action would put the two
// in competition for the same glance. Teal is the identity; orange is the
// verb.
//
// IT IS THE SAME PACKET IN ALL THREE, which was already the gate's own idea
// before this redraw: thirteen states, one sheet, and what differs is the
// badge on it. A reader moving between states sees one thing change, which is
// the one thing that changed.
//
//   act     — your move. A teal "+": start, invite, replace, answer.
//   done    — settled, and nothing is owed. A green check.
//   waiting — filed, and not your move. The packet with no badge at all.
//
// The frame — blob, ground, sparkles — is `SceneFrame`, shared with the grey
// empties, so the two sets cannot drift apart.

import { brand } from "../../../theme/tokens";
import { SceneFrame } from "../../../shared/ui/scenes/SceneFrame";

export type JourneySceneVariant = "act" | "done" | "waiting";

export type JourneySceneProps = {
  variant?: JourneySceneVariant;
  /** Rendered width in px. The gate draws these at page size. */
  size?: number;
};

/** The contour: teal at ~45% over white, the weight this product already uses
 *  for an outline that hints rather than shouts. */
const LINE = {
  stroke: brand.primarySoft,
  strokeWidth: 2.2,
  fill: brand.white,
} as const;

/** The packet. Geometry lifted from the empty states' sheet unchanged, which
 *  is what makes the grey set and this one read as one drawing style. */
function Packet() {
  return (
    <>
      <path
        d="M68 34a8 8 0 0 1 8-8h40l26 26v64a8 8 0 0 1-8 8H76a8 8 0 0 1-8-8V34Z"
        {...LINE}
        strokeLinejoin="round"
      />
      <path
        d="M116 26l26 26h-18a8 8 0 0 1-8-8V26Z"
        {...LINE}
        strokeLinejoin="round"
      />
      {/* Solid lines, where the empty sheet's are dashes. That one difference
          carries the whole distinction between the two sets: there IS
          something written on this one. */}
      {[
        { y: 72, w: 44 },
        { y: 86, w: 44 },
        { y: 100, w: 26 },
      ].map((line) => (
        <path
          key={line.y}
          d={`M84 ${line.y}h${line.w}`}
          stroke={brand.sceneTealSoft}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

/**
 * The badge, ringed in white so it reads as sitting ON the packet rather than
 * punched out of it — and in the same slot whichever glyph it carries, so
 * moving between states changes the mark and nothing else.
 */
function Badge({ glyph }: { glyph: "act" | "done" }) {
  const fill = glyph === "act" ? brand.primary : brand.success;
  return (
    <g>
      <circle cx={140} cy={104} r={20} fill={brand.white} />
      <circle cx={140} cy={104} r={16} fill={fill} />
      {glyph === "act" ? (
        <path
          d="M140 95v18M131 104h18"
          stroke={brand.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ) : (
        <path
          d="m132.5 104.5 5 5 10-10"
          fill="none"
          stroke={brand.white}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

export function JourneyScene({ variant = "act", size = 200 }: JourneySceneProps) {
  return (
    <SceneFrame width={size} blob={brand.sceneTealBlob} spark={brand.sceneTealSoft}>
      <Packet />
      {variant === "waiting" ? null : (
        <Badge glyph={variant === "done" ? "done" : "act"} />
      )}
    </SceneFrame>
  );
}

export default JourneyScene;
