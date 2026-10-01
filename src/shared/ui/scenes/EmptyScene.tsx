// src/shared/ui/scenes/EmptyScene.tsx
//
// THE EMPTY-STATE DRAWINGS. Line art: one uniform contour, white inside it, a
// soft blob behind the subject, a few thin sparkles and a ground shadow.
// Nothing is shaded, nothing recedes, nothing is lit from anywhere — the
// designer's one hard rule for the style was *"არ უნდა იყოს 3 სივრცული"*, so
// there is no gradient and no perspective in this file.
//
// It replaces two things at once: the flat blue drawings, which were the only
// saturated blue in a warm product, and the Avatar-and-glyph discs that stood
// in for them, which were quiet but were an ICON where a picture belongs — a
// 26px glyph in a circle says the same thing a button does, and an empty state
// is the one moment on a screen with room to say it properly.
//
// TWO SCENES, because that is the whole set the product needs:
//
//   empty    — there is nothing here. A record with nothing written in it.
//   notFound — we looked and there is nothing. A folder under a magnifier.
//
// Plus one that is not an empty state at all and is drawn here so it does not
// have to be drawn somewhere else:
//
//   noAccess — a padlock, for the pages a role may not open. It cannot share
//              `empty`'s drawing: a blank record under the words "You don't
//              have access to this page" says the page is EMPTY, which is
//              both wrong and the more alarming of the two readings.
//
// WHY THESE ARE DRAWN AND NOT INSTALLED. Every illustration pack — unDraw,
// Storyset, the rest — arrives with a palette and a drawing style of its own.
// You re-tint it once, and it drifts the next time anyone adds a screen, which
// is the exact state this is fixing. Drawn, every value comes from `brand`,
// so a recolour of the theme is one edit and there is no asset to re-export.
// This is the approved SVG-illustration exception.
//
// THE CHROME IS SHARED AND THE SUBJECT IS NOT. Blob, ground and sparkles live
// in `SceneFrame`, which the coloured journey drawings stand in too — so the
// grey set and the teal set are provably the same hand, and a new scene cannot
// land its blob somewhere slightly else.

import { brand } from "../../../theme/tokens";
import { SceneFrame, Sheet } from "./SceneFrame";

export type EmptySceneVariant = "empty" | "notFound" | "noAccess";

export type EmptySceneProps = {
  variant?: EmptySceneVariant;
  /**
   * TWO SIZES, AND NO THIRD. "card" is an empty inside a panel, "page" is a
   * whole screen. Call sites pick the situation, never a number — a number at
   * the call site is how the drawings this replaces ended up at 112 on one
   * screen and 120 on the next.
   */
  scale?: "card" | "page";
};

const WIDTH = { card: 168, page: 212 } as const;

/** One uniform contour for everything that is drawn. */
const LINE = { stroke: brand.sceneLine, strokeWidth: 1.8, fill: brand.white } as const;

/**
 * A record with nothing written in it.
 *
 * THREE THINGS THIS WAS FIRST. A list of three rows carrying dots and a bar —
 * which is a list WITH data in it, the one thing that is not true where this
 * appears: *"როცა ინფო არ გვაქვს, თითქოს მაგას არ ასახავს."* Then an open box,
 * on the reasoning that a container can be shown empty where a list can only
 * be shown blank; drawn flat, with no inner wall to look into, its folded-out
 * flaps read as handles and the thing came out a bag. Then the same sheet as
 * below with a second one tilted behind it, which was one object too many:
 * *"რაიმე უფრო მარტივი რომ იყოს."*
 *
 * What is left is one sheet. Nearly every empty this appears in is a record
 * that has not been made yet — no documents, no comments, no history, no
 * co-borrower — and lines left as dashes say exactly that: the shape of the
 * thing exists and nothing has been put in it. `NoLoanMark` used the same
 * device for a card that was never issued, and for the same reason: a dashed
 * outline is a SPACE, where a cross or a sad face would be a failure. That
 * mark is gone — this is what the dashboard draws now.
 */
function Empty() {
  return (
    <>
      <Sheet stroke={brand.sceneLine} strokeWidth={1.8} />

      {/* Where the writing would be, and the last line short, the way a real
          one ends. Nothing else: this record has no heading either, which is
          the difference between it and the journey's packet. Centred in the
          taller sheet rather than pushed to its foot, where three marks under
          a wide blank read as a page that had been started and abandoned. */}
      {[
        { y: 64, w: 46 },
        { y: 80, w: 46 },
        { y: 96, w: 30 },
      ].map((line) => (
        <path
          key={line.y}
          d={`M82 ${line.y}h${line.w}`}
          stroke={brand.sceneSoft}
          strokeWidth={2.2}
          strokeLinecap="round"
          /* Dashes, not dots. At a 2-unit dash the round caps closed into
             circles and the three lines read as a grid of beads rather than
             as writing that is not there. */
          strokeDasharray="6 7"
        />
      ))}
    </>
  );
}

/** A folder under a magnifier: we looked, and it is not in there. */
function NotFound() {
  return (
    <>
      {/* Two sheets tucked in, tilted, so the folder reads as holding
          something rather than as a closed box. */}
      <rect
        x={82}
        y={26}
        width={56}
        height={42}
        rx={5}
        transform="rotate(-11 110 47)"
        {...LINE}
      />
      <rect
        x={90}
        y={32}
        width={56}
        height={42}
        rx={5}
        transform="rotate(8 118 53)"
        {...LINE}
      />

      {/* The folder's back, tab and all. Drawn after the sheets so its walls
          close around them. */}
      <path
        d="M40 60a8 8 0 0 1 8-8h22l8 10h58a8 8 0 0 1 8 8v44a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V60Z"
        {...LINE}
        strokeLinejoin="round"
      />

      {/* The pocket in front, which is what makes the sheets read as INSIDE.
          Its top edge is the one straight line across the folder; the earlier
          version drew the back's full width as a second line beside it, and
          the folder came out looking like a box with a seam. */}
      <path
        d="M40 82h104v32a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V82Z"
        {...LINE}
        strokeLinejoin="round"
      />

      {/* The magnifier, over the pocket's corner and out past the blob, which
          is what stops the scene reading as one centred lump. */}
      <circle cx={124} cy={96} r={22} {...LINE} />
      {/* The handle is the one stroke allowed to be heavier, because it is a
          SOLID object rather than a contour — at contour weight it reads as
          the outline of a handle that was never filled in. */}
      <path
        d="M140.5 112.5 152 124"
        stroke={brand.sceneLine}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
    </>
  );
}

/** A padlock: the page exists and is not this reader's to open. */
function NoAccess() {
  return (
    <>
      {/* The shackle is drawn first so the body closes over its feet. */}
      <path
        d="M80 70V54a20 20 0 0 1 40 0v16"
        stroke={brand.sceneLine}
        strokeWidth={LINE.strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={62} y={68} width={76} height={54} rx={12} {...LINE} />
      <circle cx={100} cy={90} r={5} fill={brand.sceneSoft} />
      <rect x={97.5} y={92} width={5} height={14} rx={2.5} fill={brand.sceneSoft} />
    </>
  );
}

const SUBJECTS = {
  empty: Empty,
  notFound: NotFound,
  noAccess: NoAccess,
} satisfies Record<EmptySceneVariant, () => React.ReactElement>;

export function EmptyScene({ variant = "empty", scale = "card" }: EmptySceneProps) {
  const Subject = SUBJECTS[variant];

  return (
    <SceneFrame width={WIDTH[scale]} blob={brand.sceneBlob} spark={brand.sceneSoft}>
      <Subject />
    </SceneFrame>
  );
}

export default EmptyScene;
