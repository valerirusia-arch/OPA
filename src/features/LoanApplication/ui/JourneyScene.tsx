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
//               through the shape behind it too, so the state is readable
//               before a word of it is.
//   person    — waiting on somebody else.
//   failed    — that somebody was reviewed and did not pass. An amber cross.
//
// THOSE TWO DROP THE PACKET AND DRAW A PERSON'S RECORD. They were the loan's
// sheet with a person on its corner, which is a document about a person; what
// these two states are about IS the person — whether they have finished, and
// whether they passed. The subject should be the subject: *"დოკუმენტის
// მაგივრად უნდა იყოს კაცუნა."* The frame is the same, so they still belong to
// the set. See `PersonCard` for why it is a card and not a bare figure.
//
// BOTH WERE ONCE `attention`, AND SHOULD NOT HAVE BEEN. An exclamation mark
// over "Waiting on your co-borrower" alarms a reader about a state in which
// nothing has gone wrong, and the same mark over "didn't qualify" is too mild
// for the one that did. Amber stays on the cross because this is still a
// detour and not a dead end — nothing filled in is lost and another
// invitation carries it on. Red would say otherwise.
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
import { SceneFrame, Sheet } from "../../../shared/ui/scenes/SceneFrame";

export type JourneySceneVariant =
  | "act"
  | "done"
  | "waiting"
  | "attention"
  | "person"
  | "failed";

export type JourneySceneProps = {
  variant?: JourneySceneVariant;
  /** Rendered width in px. The gate draws these at page size. */
  size?: number;
};

/** The contour weight. The grey itself is shared with every other drawing;
 *  this is a hair heavier than the empty states' 1.8, because these are
 *  page-sized and carrying a page rather than apologising for one. */
const CONTOUR = 2.2;

const LINE_PROPS = {
  stroke: brand.sceneLine,
  strokeWidth: CONTOUR,
  fill: brand.white,
} as const;

/** What each state is drawn in. `ink` is the sparkles now — the packet's own
 *  contents are the same grey in every state; see `Packet`. */
const TONE = {
  act: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: brand.primary },
  done: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: brand.success },
  waiting: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: null },
  attention: { ink: brand.sceneAmberSoft, blob: brand.sceneAmberBlob, badge: brand.warning },
  /* No badge. Nothing has happened to this person yet — they have been
     invited and have not finished — and a mark on them would say something
     has. The figure alone is the state. */
  person: { ink: brand.sceneTealSoft, blob: brand.sceneTealBlob, badge: null },
  failed: { ink: brand.sceneAmberSoft, blob: brand.sceneAmberBlob, badge: brand.warning },
} satisfies Record<JourneySceneVariant, { ink: string; blob: string; badge: string | null }>;

/**
 * The packet: the shared sheet, drawn exactly as the empty states draw it.
 *
 * ITS LINES WERE SOLID AND IN THE STATE'S OWN COLOUR, on the reasoning that
 * solid-versus-dashed was the one mark separating a record with something in
 * it from a record with nothing. It separated them too well: two documents
 * side by side in the same product, one written in teal and one in grey
 * dashes, read as two different objects rather than one page in two moments.
 * *"დოკუმენტში შიგნით ტექსტი ნაცრისფრად იყოს, როგორც დეშბორდზეა... მსგავსი
 * წყვეტილი ხაზები იყოს ყველგან."*
 *
 * So the sheet is now the same sheet everywhere and the STATE IS CARRIED BY
 * THE BADGE AND THE SHAPE BEHIND IT — which is the better division anyway:
 * the thing that changes between states is the thing that is drawn
 * differently, and the document, which does not change, is not.
 *
 * The heading bar stays. It is what makes this a form rather than three marks
 * on a page, and it is the one thing the empty record does not have: nothing
 * has been written there, not even a title.
 */
function Packet() {
  return (
    <>
      <Sheet stroke={brand.sceneLine} strokeWidth={CONTOUR} />

      <rect x={82} y={56} width={32} height={6} rx={3} fill={brand.sceneSoft} />

      {[
        { y: 78, w: 46 },
        { y: 92, w: 46 },
        { y: 106, w: 30 },
      ].map((line) => (
        <path
          key={line.y}
          d={`M82 ${line.y}h${line.w}`}
          stroke={brand.sceneSoft}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeDasharray="6 7"
        />
      ))}
    </>
  );
}

/**
 * A PERSON'S RECORD: the subject of the two states that are about a person.
 *
 * It was the bare head-and-shoulders first, which is what this product draws
 * a person AS — and that is exactly why it failed here. Alone in the frame it
 * is an avatar placeholder: a glyph, with no inside, no structure and nothing
 * to look at, which is the same mistake the Avatar-and-icon discs made before
 * any of these were drawn. *"არ ვარგა ესე, რამე უფრო მინდა რომ მოჯდარი იყოს,
 * უფრო დახვეწილი."*
 *
 * So the person is ON something. A card with their picture and their details
 * is an OBJECT — it has an edge, a layout and contents — and it sits in the
 * frame the way the packet does, takes the badge in the same corner, and is
 * still unmistakably about somebody rather than about a document. The details
 * are the same grey dashes as every other record in the set: this person's
 * part is not filled in, which is the whole state.
 */
function PersonCard() {
  return (
    <>
      <path
        d="M54 52a12 12 0 0 1 12-12h72a12 12 0 0 1 12 12v60a12 12 0 0 1-12 12H66a12 12 0 0 1-12-12V52Z"
        {...LINE_PROPS}
        strokeLinejoin="round"
      />

      {/* The picture on it. */}
      <circle cx={82} cy={72} r={12} {...LINE_PROPS} />
      <path
        d="M68 102c0-7.7 6.3-14 14-14s14 6.3 14 14v2a3 3 0 0 1-3 3H71a3 3 0 0 1-3-3v-2Z"
        {...LINE_PROPS}
        strokeLinejoin="round"
      />

      {/* And their details beside it. The last line is short twice over: a
          real one ends early, and the badge's ring comes in at x=125. */}
      {[
        { y: 72, w: 34 },
        { y: 86, w: 34 },
        { y: 100, w: 14 },
      ].map((line) => (
        <path
          key={line.y}
          d={`M106 ${line.y}h${line.w}`}
          stroke={brand.sceneSoft}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeDasharray="6 7"
        />
      ))}
    </>
  );
}

/**
 * The badge, ringed in white so it reads as sitting ON the packet rather than
 * punched out of it — and in the same slot whichever glyph it carries, so
 * moving between states changes the mark and nothing else.
 *
 * Placed so its ring clears the body lines: at (141, 112) the nearest it
 * comes to the middle line is tangent, and to the short last line it leaves
 * ten units. Sitting higher, the ring cut across the end of a line and the
 * packet read as a document with a hole punched in it.
 */
function Badge({
  variant,
  fill,
}: {
  variant: JourneySceneVariant;
  fill: string;
}) {
  return (
    <g>
      <circle cx={141} cy={112} r={20} fill={brand.white} />
      <circle cx={141} cy={112} r={16} fill={fill} />
      {variant === "done" ? (
        <path
          d="m133.5 112.5 5 5 10-10"
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
          <rect x={139.4} y={103} width={3.2} height={11} rx={1.6} fill={brand.white} />
          <circle cx={141} cy={118.6} r={1.9} fill={brand.white} />
        </>
      ) : variant === "failed" ? (
        <path
          d="M135 106l12 12M147 106l-12 12"
          stroke={brand.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ) : variant === "person" ? (
        <>
          {/* The same figure the contact panel's badge carries, so "a person"
              means one thing in this product's drawings. */}
          <circle cx={141} cy={107.5} r={4.6} fill={brand.white} />
          <path
            d="M133 121c0-4.8 3.6-8 8-8s8 3.2 8 8"
            fill="none"
            stroke={brand.white}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="M141 103v18M132 112h18"
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
      {variant === "person" || variant === "failed" ? <PersonCard /> : <Packet />}
      {tone.badge ? <Badge variant={variant} fill={tone.badge} /> : null}
    </SceneFrame>
  );
}

export default JourneyScene;
