// src/shared/ui/empty/EmptyArt.tsx
//
// THE EMPTY-STATE ILLUSTRATION FAMILY, ONE STYLE FOR THE WHOLE PRODUCT.
//
// Flat, light-blue drawings matched to the designer's Figma reference: a soft
// periwinkle disc with a clean white object centred in it. One component, a few
// MOTIFS, so every "nothing here yet" state reads as one drawing style instead
// of the mixed set the product had grown — a different look in the application,
// on the borrower pages and in the back office.
//
//   doc      — an empty sheet: nothing created, no records, no documents
//   search   — a magnifier: a list a filter or a search emptied out
//   plus     — a sheet with a + badge: start / add (an application, a co-borrower)
//   check    — a sheet with a ✓ badge: done, submitted, settled, all paid
//   schedule — a calendar: a repayment schedule that does not exist yet
//
// Centred in the disc, the sheet's corner a real visible fold, kept as clean
// and light as it can be. Colours come from `brand` (the one place raw hex is
// allowed), so a later recolour — the designer may mute these — is a single
// edit in tokens.ts. This is the approved SVG-illustration exception.

import { brand } from "../../../theme/tokens";

export type EmptyArtVariant = "doc" | "search" | "plus" | "check" | "schedule";

export type EmptyArtProps = {
  /** Which motif. Defaults to the document. */
  variant?: EmptyArtVariant;
  /** Rendered size in px (square). */
  size?: number;
};

const SRC = 160;

/** The sheet, with a folded top-right corner and a few lines. */
function Doc() {
  return (
    <>
      <path
        d="M54 34h38l20 20v66a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6Z"
        fill={brand.white}
      />
      {/* The fold — a visible flap in a clear light blue. */}
      <path d="M92 34l20 20H98a6 6 0 0 1-6-6V34Z" fill={brand.illoSoft} opacity={0.55} />
      {/* The blue header band, with two white lines. */}
      <rect x={60} y={62} width={40} height={20} rx={5} fill={brand.illoInk} />
      <rect x={66} y={68} width={22} height={3.5} rx={1.75} fill={brand.white} />
      <rect x={66} y={74} width={14} height={3.5} rx={1.75} fill={brand.white} opacity={0.7} />
      {/* The body lines. */}
      <rect x={60} y={95} width={40} height={4} rx={2} fill={brand.illoSoft} />
      <rect x={60} y={105} width={28} height={4} rx={2} fill={brand.illoFaint} />
      <rect x={60} y={115} width={34} height={4} rx={2} fill={brand.illoFaint} />
    </>
  );
}

/** A corner badge on the sheet — a blue disc with a white glyph, ringed in the
 *  page colour so it reads apart from the document it sits on. */
function Badge({ glyph }: { glyph: "plus" | "check" }) {
  return (
    <g>
      <circle cx={104} cy={112} r={17} fill={brand.white} />
      <circle cx={104} cy={112} r={13} fill={brand.illoInk} />
      {glyph === "plus" ? (
        <>
          <rect x={103} y={105} width={2.5} height={14} rx={1.25} fill={brand.white} />
          <rect x={97} y={110.75} width={14} height={2.5} rx={1.25} fill={brand.white} />
        </>
      ) : (
        <path
          d="M98.5 112.5l3.8 3.8 7-7.6"
          fill="none"
          stroke={brand.white}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

/** A magnifier — a list a search or a filter emptied out. */
function Search() {
  return (
    <>
      <circle cx={74} cy={74} r={24} fill={brand.white} />
      <circle cx={74} cy={74} r={24} fill="none" stroke={brand.illoInk} strokeWidth={7} />
      <rect x={64} y={70} width={20} height={3.5} rx={1.75} fill={brand.illoSoft} />
      <rect x={64} y={78} width={13} height={3.5} rx={1.75} fill={brand.illoFaint} />
      <rect
        x={90}
        y={90}
        width={28}
        height={10}
        rx={5}
        transform="rotate(45 90 90)"
        fill={brand.illoInk}
      />
    </>
  );
}

/** A calendar — a repayment schedule not generated yet. */
function Schedule() {
  return (
    <>
      {/* Two hanger tabs. */}
      <rect x={66} y={40} width={5} height={14} rx={2.5} fill={brand.illoSoft} />
      <rect x={89} y={40} width={5} height={14} rx={2.5} fill={brand.illoSoft} />
      {/* The body, with a blue top band. */}
      <rect x={48} y={48} width={64} height={70} rx={8} fill={brand.white} />
      <path d="M48 56a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H48v-8Z" fill={brand.illoInk} />
      {/* The date grid — a couple filled, the rest faint. */}
      <circle cx={62} cy={80} r={4} fill={brand.illoSoft} />
      <circle cx={80} cy={80} r={4} fill={brand.illoFaint} />
      <circle cx={98} cy={80} r={4} fill={brand.illoFaint} />
      <circle cx={62} cy={98} r={4} fill={brand.illoFaint} />
      <circle cx={80} cy={98} r={4} fill={brand.illoSoft} />
      <circle cx={98} cy={98} r={4} fill={brand.illoFaint} />
    </>
  );
}

export function EmptyArt({ variant = "doc", size = 148 }: EmptyArtProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${SRC} ${SRC}`}
      role="img"
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* The soft disc ground, centred — the one constant across the family. */}
      <circle cx={80} cy={80} r={62} fill={brand.illoGround} />
      {variant === "search" ? (
        <Search />
      ) : variant === "schedule" ? (
        <Schedule />
      ) : (
        <>
          <Doc />
          {variant === "plus" ? <Badge glyph="plus" /> : null}
          {variant === "check" ? <Badge glyph="check" /> : null}
        </>
      )}
    </svg>
  );
}

export default EmptyArt;
