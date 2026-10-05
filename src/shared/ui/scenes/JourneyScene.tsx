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
//   done      — settled, or decided in the reader's favour. A green check.
//   review    — with OPA, and being looked at. A teal clock.
//   attention — something needs looking at. An amber "!", and the amber runs
//               through the shape behind it too, so the state is readable
//               before a word of it is.
//   invite    — somebody has asked you to join theirs. Their record, with an
//               envelope on it.
//   person    — waiting on somebody else. The review clock, on their record:
//               what is being waited for is time, the same as with OPA.
//   failed    — somebody was reviewed and did not pass. An amber cross, and
//               BOTH SIDES OF THAT EVENT WEAR IT: the borrower is told their
//               co-borrower did not qualify, the co-borrower is told their
//               invitation is no longer active, and it is one thing that
//               happened. They never share a screen, so one mark for one
//               event is the whole of it.
//   blocked   — a check stopped it and the reader cannot undo that. A red
//               padlock: not a cross, because nothing was judged — the
//               application never reached a decision.
//   ineligible— the ACCOUNT may not apply. The same padlock in amber,
//               because that screen offers a way to contest it.
//   cancelled — the borrower ended it themselves. The same cross in amber:
//               something stopped, and nobody was refused.
//   declined  — the APPLICATION was reviewed and did not pass. The same cross
//               on the packet, and RED where `failed` is amber: a co-borrower
//               who did not qualify is replaced and the application carries
//               on, which is a detour; this one is the end of that
//               application. Dressing it in the colour of the recoverable
//               states understates it.
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
import { SceneFrame, Sheet } from "./SceneFrame";

export type JourneySceneVariant =
  | "act"
  | "done"
  | "review"
  | "invite"
  | "blocked"
  | "cancelled"
  | "ineligible"
  | "declined"
  | "attention"
  | "person"
  /** AN ACCOUNT created — the upright ID card with the finished check. The one
   *  state that stands the card PORTRAIT: not the landscape person-card the
   *  borrower and the identity check wear, and not the application sheet. */
  | "verified"
  /** IDENTITY verified — the landscape person-card with the finished check, the
   *  way it was: *"აიდენთითი ისე დააბრუნე როგორც იყო."* A clock would say it is
   *  still being looked at; the check says it matched. What separates it from
   *  the new account is the card's orientation, and from the borrower, the
   *  badge (check, not clock). */
  | "identity"
  | "failed";

export type JourneySceneProps = {
  variant?: JourneySceneVariant;
  /** Rendered width in px. The gate draws these at page size. */
  size?: number;
  /** The status badge in the corner. On by default; off for the one state that
   *  carries no status — the plain "start an application" invitation. */
  badge?: boolean;
};

/** The outline weight for these illustrations. Thin on purpose — the heavier
 *  line read as clumsy at page size, so it was brought down across every journey
 *  scene (the empty states keep their own weight). *"სთროუკებს მოაკელ."* */
const STROKE = 1.5;

/**
 * ILLUSTRATION COLOUR IS CONSTANT; THE BADGE CARRIES THE STATUS.
 *
 * Every scene is drawn in one base palette — a teal outline, a teal figure and
 * heading, light-blue body lines — and nothing in the drawing changes between
 * states. Only the round status badge in the corner takes the state's colour.
 * *"ილუსტრაციებს ფერი არ შეეცვლებათ, მხოლოდ ამ მრგვალ სტატუსებს."* This replaces
 * the old per-state tinting, where the whole shape turned amber or red.
 */
const BASE = {
  /** Outline and tint — person-card panel, photo disc, sparkles. */
  soft: brand.sceneTealSoft,
  /** The figure and the packet's heading bar. */
  strong: brand.primary,
  /** The packet's written-in body lines — a light blue. */
  lines: brand.sceneSlateSoft,
  /** The shape behind the subject. */
  blob: brand.sceneTealBlob,
} as const;

/**
 * THE ONE THING THAT CHANGES BY STATE — the badge fill. Teal is the identity (a
 * move to make, in progress, a person, an invitation); green the finished mark;
 * amber a state to attend to or a stop that is not a refusal; red a refusal.
 *
 * Two the designer set against the earlier reading, by eye in context:
 *   · `failed` — the co-borrower did not qualify — is RED. *"აქ წითელი."*
 *   · `blocked` — the application was stopped — is AMBER, not red: red looked
 *     wrong in the padlock, amber sits in it. *"წითელი არ გამოდგება,
 *     ნარინჯისფერი ჩაჯდება."*
 */
const BADGE = {
  act: brand.primary,
  done: brand.success,
  review: brand.primary,
  attention: brand.warning,
  invite: brand.primary,
  person: brand.primary,
  verified: brand.success,
  identity: brand.success,
  failed: brand.danger,
  declined: brand.danger,
  blocked: brand.warning,
  cancelled: brand.warning,
  ineligible: brand.warning,
} satisfies Record<JourneySceneVariant, string>;

type SubjectTone = { soft: string; strong: string };

/** The packet's colours, with the heading bar, the body lines and the outline
 *  weight overridable independently of the tone (used to try the first state). */
type PacketTone = SubjectTone & {
  outlineWidth?: number;
  heading?: string;
  lines?: string;
};

/**
 * The packet — the application's sheet, drawn as a coloured illustration.
 *
 * The OUTLINE is the soft tint, not the strong colour — the same light edge the
 * person-card and the account badge wear, so a page full of these scenes reads
 * evenly instead of the documents shouting in a heavy dark line:
 * *"ძალიან მძიმე სთროუკი აქვს... დააბალანსე."* The one strong note is the
 * heading bar, the way the person-card's one strong note is the figure. The
 * written-in lines are the soft tint — solid, not dashed: there is an
 * application, and the dashes are the empty states' way of saying there is not.
 * The sheet shape itself is shared with the empty record through `Sheet`.
 */
function Packet({ soft, strong, outlineWidth = STROKE, heading, lines }: PacketTone) {
  /* The heading bar and the body lines default to the tone's strong/soft, but
     can be overridden independently — the first state is being tried in a slate
     pair rather than the teal, and with a thinner outline. */
  const headingFill = heading ?? strong;
  const lineFill = lines ?? soft;
  return (
    <>
      <Sheet stroke={soft} strokeWidth={outlineWidth} />

      <rect x={82} y={56} width={34} height={6} rx={3} fill={headingFill} />

      {[
        { y: 76, w: 46 },
        { y: 90, w: 46 },
        { y: 104, w: 30 },
      ].map((line) => (
        <rect
          key={line.y}
          x={82}
          y={line.y}
          width={line.w}
          height={5}
          rx={2.5}
          fill={lineFill}
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
function PersonCard({ soft, strong }: SubjectTone) {
  return (
    <>
      <path
        d="M54 52a12 12 0 0 1 12-12h72a12 12 0 0 1 12 12v60a12 12 0 0 1-12 12H66a12 12 0 0 1-12-12V52Z"
        fill={brand.white}
        stroke={soft}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />

      {/* The picture on it: a tinted disc with the figure filled inside. */}
      <defs>
        <clipPath id="personCardAvatar">
          <circle cx={82} cy={72} r={18} />
        </clipPath>
      </defs>
      <circle cx={82} cy={72} r={18} fill={soft} />
      <g clipPath="url(#personCardAvatar)">
        <circle cx={82} cy={67} r={8} fill={strong} />
        <circle cx={82} cy={95} r={13} fill={strong} />
      </g>

      {/* And their details beside it. The last line is short twice over: a
          real one ends early, and the badge's ring comes in at the corner. */}
      {[
        { y: 64, w: 36 },
        { y: 78, w: 36 },
        { y: 92, w: 18 },
      ].map((line) => (
        <rect
          key={line.y}
          x={106}
          y={line.y}
          width={line.w}
          height={5}
          rx={2.5}
          fill={soft}
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
/**
 * AN ID BADGE — the new account, and the ONE scene drawn as a full illustration
 * rather than in the grey line-art the rest of the set shares.
 *
 * WHY THIS ONE BREAKS THE GREY. The grey contour is, by design, the empty
 * states' own hand — and on the account screen that is exactly the problem: a
 * pale outline of a card reads as "nothing here yet" on the very screen that
 * says you now HAVE something. *"ეს ცოტა ემფთი სთეითს ჰგავს... ცოტა უფრო ისე,
 * რომ ეტყობოდეს რომ ილუსტრაციაა და არა ემფთი სთეითი."* So this one is filled
 * and coloured: a teal figure in a tinted photo, the details written in rather
 * than dashed, an eyelet and clip so it reads as a badge you now wear. Every
 * colour is a theme token; the green check stays the finished mark.
 */
function IdCard() {
  return (
    <>
      {/* The eyelet and clip — a badge you could hang, not just a card. */}
      <circle cx={102} cy={13} r={6} fill={brand.white} stroke={brand.primary} strokeWidth={3} />
      <rect x={96} y={18} width={12} height={10} rx={2} fill={brand.primary} />

      <rect
        x={60}
        y={26}
        width={84}
        height={94}
        rx={14}
        fill={brand.white}
        stroke={brand.sceneTealSoft}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />

      {/* The photo: a tinted disc with the figure clipped to sit within it. */}
      <defs>
        <clipPath id="idCardAvatar">
          <circle cx={102} cy={60} r={24} />
        </clipPath>
      </defs>
      <circle cx={102} cy={60} r={24} fill={brand.sceneTealSoft} />
      <g clipPath="url(#idCardAvatar)">
        <circle cx={102} cy={54} r={10} fill={brand.primary} />
        <circle cx={102} cy={90} r={17} fill={brand.primary} />
      </g>

      {/* Name and email, written in rather than dashed — this account exists. */}
      <rect x={82} y={96} width={40} height={5} rx={2.5} fill={brand.sceneTealSoft} />
      <rect x={90} y={107} width={24} height={5} rx={2.5} fill={brand.sceneTealSoft} />
    </>
  );
}

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
      {variant === "blocked" || variant === "ineligible" ? (
        <>
          {/* A padlock: the thing is shut, and not by anything the reader
              did or can undo. The shackle first, so the body closes over
              its feet — the same order the empty states' lock is drawn in. */}
          <path
            d="M136 110v-4a5 5 0 0 1 10 0v4"
            fill="none"
            stroke={brand.white}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <rect x={133.5} y={109.5} width={15} height={10.5} rx={2.5} fill={brand.white} />
        </>
      ) : variant === "invite" ? (
        <>
          {/* An envelope: this person sent you something. A "+" would have
              read as "add this person", which is backwards — they are
              already on it and the one being added is the reader. */}
          <rect
            x={133}
            y={105.5}
            width={16}
            height={13}
            rx={2.5}
            fill="none"
            stroke={brand.white}
            strokeWidth={2}
          />
          <path
            d="M133.5 107.5 141 113l7.5-5.5"
            fill="none"
            stroke={brand.white}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : variant === "review" || variant === "person" ? (
        <>
          {/* A clock: the application is somewhere, and the somewhere is time
              passing rather than a decision made. */}
          <circle
            cx={141}
            cy={112}
            r={8.5}
            fill="none"
            stroke={brand.white}
            strokeWidth={2.4}
          />
          <path
            d="M141 106.5V112h4.5"
            fill="none"
            stroke={brand.white}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : variant === "done" || variant === "verified" || variant === "identity" ? (
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
      ) : variant === "failed" || variant === "declined" || variant === "cancelled" ? (
        <path
          d="M135 106l12 12M147 106l-12 12"
          stroke={brand.white}
          strokeWidth={3}
          strokeLinecap="round"
        />
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

export function JourneyScene({ variant = "act", size = 200, badge = true }: JourneySceneProps) {
  return (
    <SceneFrame width={size} blob={BASE.blob} spark={BASE.soft}>
      {variant === "verified" ? (
        <IdCard />
      ) : variant === "person" ||
        variant === "failed" ||
        variant === "invite" ||
        variant === "identity" ? (
        <PersonCard soft={BASE.soft} strong={BASE.strong} />
      ) : (
        <Packet soft={BASE.soft} strong={BASE.strong} lines={BASE.lines} />
      )}
      {badge ? <Badge variant={variant} fill={BADGE[variant]} /> : null}
    </SceneFrame>
  );
}

export default JourneyScene;
