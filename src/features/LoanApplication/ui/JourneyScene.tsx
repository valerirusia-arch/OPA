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
// verb. Amber is the exception and earns it by meaning something — see
// `attention` below.
//
// IT IS THE SAME PACKET IN ALL FOUR, which was already the gate's own idea
// before this redraw: thirteen states, one sheet, and what differs is the
// badge on it. A reader moving between states sees one thing change, which is
// the one thing that changed.
//
//   act       — your move. A teal "+": start, invite, replace, answer.
//   done      — settled, and nothing is owed. A green check.
//   waiting   — filed, and not your move. The packet with no badge at all.
//   attention — something needs looking at. An amber "!", and the amber runs
//               through the packet's own lines and the shape behind it, so
//               the state is readable before a word of it is.
//
// THE CONTOUR IS GREY IN ALL FOUR, and the same grey as the empty states —
// *"სთროუკი ისევ იგივე ნაცრისფერი უნდა იყოს, რაც სხვაგან."* It was teal, and
// teal outline plus teal contents plus teal badge made the colour the subject
// of the picture rather than a thing the picture says. Held in the shared
// grey, the colour lands only where it means something: the lines that have
// been written, and the badge that says what state this is.
//
// The frame — blob, ground, sparkles — is `SceneFrame`, shared with the grey
// empties, so the two sets cannot drift apart.

import { brand } from "../../../theme/tokens";
import { SceneFrame } from "../../../shared/ui/scenes/SceneFrame";

export type JourneySceneVariant = "act" | "done" | "waiting" | "attention";

export type JourneySceneProps = {
  variant?: JourneySceneVariant;
  /** Rendered width in px. The gate draws these at page size. */
  size?: number;
};

/** The contour, shared with every other drawing in the product. Heavier than
 *  the empty states' 1.8, because these are page-sized and carrying a page. */
const LINE = {
  stroke: brand.sceneLine,
  strokeWidth: 2.2,
  fill: brand.white,
} as const;

/** What each state is drawn in: the lines inside the packet, the shape behind
 *  it, and the badge on it. */
const TONE = {
  act: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: brand.primary },
  done: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: brand.success },
  waiting: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: null },
  attention: { ink: brand.sceneAmberSoft, blob: brand.sceneAmberBlob, badge: brand.warning },
} satisfies Record<JourneySceneVariant, { ink: string; blob: string; badge: string | null }>;

/** The packet. Geometry lifted from the empty states' sheet unchanged, which
 *  is what makes the grey set and this one read as one drawing style. */
function Packet({ ink }: { ink: string }) {
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
          stroke={ink}
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
function Badge({ variant, fill }: { variant: JourneySceneVariant; fill: string }) {
  return (
    <g>
      <circle cx={140} cy={104} r={20} fill={brand.white} />
      <circle cx={140} cy={104} r={16} fill={fill} />
      {variant === "done" ? (
        <path
          d="m132.5 104.5 5 5 10-10"
          fill="none"
          stroke={brand.white}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : variant === "attention" ? (
        <>
          {/* Drawn rather than set in type: an exclamation mark at this size
              is two shapes, and the font's would arrive with its own metrics
              and sit off the circle's centre. */}
          <rect x={138.4} y={95} width={3.2} height={11} rx={1.6} fill={brand.white} />
          <circle cx={140} cy={110.6} r={1.9} fill={brand.white} />
        </>
      ) : (
        <path
          d="M140 95v18M131 104h18"
          stroke={brand.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

export function JourneyScene({ variant = "act", size = 200 }: JourneySceneProps) {
  const tone = TONE[variant];

  return (
    <SceneFrame width={size} blob={tone.blob} spark={tone.ink}>
      <Packet ink={tone.ink} />
      {tone.badge ? <Badge variant={variant} fill={tone.badge} /> : null}
    </SceneFrame>
  );
}

export default JourneyScene;
