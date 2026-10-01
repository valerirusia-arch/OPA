// src/shared/ui/empty/EmptyScene.tsx
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
//   empty    — there is nothing here. A list with its rows blank.
//   notFound — we looked and there is nothing. A folder under a magnifier.
//
// Plus one that is not an empty state at all and is drawn here so it does not
// have to be drawn somewhere else:
//
//   noAccess — a padlock, for the pages a role may not open. It cannot share
//              `empty`'s drawing: blank rows under the words "You don't have
//              access to this page" say the page is EMPTY, which is both wrong
//              and the more alarming of the two readings.
//
// WHY THESE ARE DRAWN AND NOT INSTALLED. Every illustration pack — unDraw,
// Storyset, the rest — arrives with a palette and a drawing style of its own.
// You re-tint it once, and it drifts the next time anyone adds a screen, which
// is the exact state this is fixing. Drawn, every value comes from `brand`,
// so a recolour of the theme is one edit and there is no asset to re-export.
// This is the approved SVG-illustration exception.
//
// THE CHROME IS SHARED AND THE SUBJECT IS NOT. Blob, ground and sparkles are
// composed once below and drawn for every scene in the same places, which is
// what makes three different objects read as one family rather than as three
// drawings that happen to be grey.

import { brand } from "../../../theme/tokens";

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

/** The artwork is laid out in this box and scaled from it. */
const BOX = { w: 200, h: 150 };
const WIDTH = { card: 168, page: 212 } as const;

/** One uniform contour for everything that is drawn. */
const LINE = { stroke: brand.sceneLine, strokeWidth: 2.2, fill: brand.white } as const;

/**
 * The soft shape behind the subject. Irregular on purpose: a circle behind an
 * object reads as a plate it has been placed on, and a blob reads as depth of
 * field — which is the only kind of depth this style allows itself.
 */
const BLOB =
  "M44 48C54 26 82 16 110 22C138 28 162 44 164 70C166 96 144 114 114 118" +
  "C84 122 50 114 42 92C36 76 38 62 44 48Z";

/** A thin cross. Three of them, at three sizes, is what keeps the frame from
 *  looking like a cropped icon. */
function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r}V${y + r}M${x - r} ${y}H${x + r}`}
      stroke={brand.sceneSoft}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  );
}

/** A list with nothing in its rows. */
function Empty() {
  return (
    <>
      {/*
        Stepped left going down, and the top one lifted off square.

        Three identical rectangles in a column read as a table that has lost
        its data — a thing that is broken. Stepped, they read as a stack; and
        with the top one tilted, as a stack being gone through, which is the
        difference between "something is wrong here" and "there is nothing in
        here yet". It is the same move the folder's sheets make, which is what
        ties the two scenes together.
      */}
      {[
        { x: 66, y: 24, tilt: "rotate(-7 112 37)" },
        { x: 56, y: 60, tilt: undefined },
        { x: 48, y: 94, tilt: undefined },
      ].map((row) => (
        <g key={row.y} transform={row.tilt}>
          <rect x={row.x} y={row.y} width={92} height={26} rx={7} {...LINE} />
          {[20, 33, 46].map((dx) => (
            <circle
              key={dx}
              cx={row.x + dx}
              cy={row.y + 13}
              r={3.4}
              fill={brand.sceneSoft}
            />
          ))}
          <rect
            x={row.x + 60}
            y={row.y + 9.5}
            width={22}
            height={7}
            rx={3.5}
            fill={brand.sceneSoft}
          />
        </g>
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
      <circle cx={124} cy={96} r={22} {...LINE} strokeWidth={2.4} />
      <path
        d="M140.5 112.5 152 124"
        stroke={brand.sceneLine}
        strokeWidth={5.5}
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
        strokeWidth={2.4}
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
  const width = WIDTH[scale];

  return (
    <svg
      width={width}
      height={Math.round((width * BOX.h) / BOX.w)}
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      fill="none"
      role="presentation"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={BLOB} fill={brand.sceneBlob} />
      <Subject />
      {/* The ground last of the solids: a flat ellipse, no blur, so the object
          stands on the page without being lit by anything. */}
      <ellipse cx={96} cy={132} rx={54} ry={4} fill={brand.sceneBlob} />
      <Sparkle x={36} y={38} r={5.5} />
      <Sparkle x={170} y={46} r={4} />
      <Sparkle x={30} y={100} r={4.5} />
    </svg>
  );
}

export default EmptyScene;
