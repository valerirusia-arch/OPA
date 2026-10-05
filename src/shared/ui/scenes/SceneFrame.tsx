// src/shared/ui/scenes/SceneFrame.tsx
//
// THE CHROME EVERY DRAWING IN THIS PRODUCT STANDS IN.
//
// A soft blob behind the subject, a flat ground shadow under it, three thin
// sparkles around it, and one box they are all laid out in. Composed here once
// rather than in each scene, because this is the whole reason two different
// sets of pictures — the grey empties and the coloured journey — read as one
// hand: the subjects differ, the frame never does.
//
// It is also what stops the next drawing drifting. A new scene supplies a
// subject and a tone and gets the family for free; there is no way to draw one
// that sits in a slightly different place or carries a fourth sparkle.
//
// Flat throughout. No gradient, no perspective, no light source — the
// designer's hard rule for the style: *"არ უნდა იყოს 3 სივრცული."*

import type { ReactNode } from "react";
import { brand } from "../../../theme/tokens";

/* Everything is laid out in this box and scaled from it. Not exported: a
   scene supplies a subject and a width, never a coordinate system, and the
   lint rule for fast refresh wants this file to export components only. */
const BOX = { w: 200, h: 150 } as const;

/**
 * The soft shape behind the subject. Irregular on purpose: a circle behind an
 * object reads as a plate it has been placed on, and a blob reads as depth of
 * field — which is the only kind of depth this style allows itself.
 */
const BLOB =
  "M47 66C45 46 65 33 95 33C127 33 159 39 161 65C163 89 143 105 113 108" +
  "C83 111 55 105 50 89C46 79 49 76 47 66Z";

/** A thin cross. Three of them, at three sizes, is what keeps a frame from
 *  looking like a cropped icon. */
function Sparkle({ x, y, r, tone }: { x: number; y: number; r: number; tone: string }) {
  return (
    <path
      d={`M${x} ${y - r}V${y + r}M${x - r} ${y}H${x + r}`}
      stroke={tone}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  );
}

/**
 * THE SHEET BOTH REGISTERS DRAW — the empty states' blank record and the
 * journey's packet. Shared rather than copied, because "the same hand" has to
 * be a fact about the code and not a thing two files happen to agree on.
 *
 * TALLER THAN IT WAS, at 76 × 108 — a 0.70 ratio, which is A4's. At 74 × 98 it
 * sat between a page and a card and read as neither: *"სიგრძეში ოდნავ რომ
 * მოუმატო, მგონი უკეთესი იქნება."* The extra height is also what gives the
 * contents room to be a document rather than three marks.
 *
 * What goes ON it is each register's own business — dashes where nothing has
 * been written, a heading and solid lines where something has.
 */
export function Sheet({ stroke, strokeWidth }: { stroke: string; strokeWidth: number }) {
  const line = { stroke, strokeWidth, fill: brand.white, strokeLinejoin: "round" } as const;
  return (
    <>
      <path
        d="M66 28a8 8 0 0 1 8-8h42l26 26v74a8 8 0 0 1-8 8H74a8 8 0 0 1-8-8V28Z"
        {...line}
      />
      {/* The corner turned down — the one mark that makes a rounded rectangle
          a sheet rather than a card. */}
      <path d="M116 20l26 26h-18a8 8 0 0 1-8-8V20Z" {...line} />
    </>
  );
}

export type SceneFrameProps = {
  /** Rendered width in px; the height follows the box. */
  width: number;
  /** The soft shape behind the subject. The ground is NOT this — see below. */
  blob: string;
  /** The sparkles. */
  spark: string;
  /** The subject, drawn between the blob and the ground. */
  children: ReactNode;
  /**
   * How large the subject sits inside the frame. 1 fills it; below 1 leaves more
   * air around it, which is the empty-state set's look — the object small and
   * calm in its space. Scaled about its feet so it stays on the ground.
   */
  subjectScale?: number;
};

export function SceneFrame({ width, blob, spark, children, subjectScale = 1 }: SceneFrameProps) {
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
      <path d={BLOB} fill={blob} />
      {/*
        THE GROUND IS THE SAME IN EVERY SCENE, AND IT IS NOT THE BLOB.

        It was drawn in the blob's colour, so the amber state's shadow came
        out amber — *"ჩრდილი არ უნდა იცვლებოდეს ფერი არასდროს, მუდამ ერთი და
        იგივე უნდა იყოს."* Right, and for a reason worth writing down: the
        blob is a thing the picture SAYS — teal for the journey, amber for a
        state that wants looking at — while the ground is a fact about where
        the subject is standing. A floor that changes colour with the mood of
        what is on it is the one thing in a flat drawing that gives the whole
        illusion away.

        UNDER the subject, not over it. It was drawn last, so it washed across
        the foot of whatever stood on it — the sheet's bottom edge, and any
        badge that reached below the sheet. A shadow is behind the thing
        casting it. Flat, no blur: the subject stands on the page without
        being lit by anything.

        AND CLEAR OF IT. Its top edge met the sheet's bottom exactly, so the
        two read as one shape with a grey skirt rather than as an object and
        its shadow: *"ჩრდილი მიწებებულია, დააშორე, ჩამოწიე დაბლა."* Seven
        units of air below the tallest subject in the set. Narrower too, at
        50 — a detached ellipse that overhangs the thing casting it stops
        being a shadow and becomes a second object.
      */}
      <ellipse cx={96} cy={139} rx={50} ry={4} fill={brand.sceneBlob} />
      {subjectScale === 1 ? (
        children
      ) : (
        /* Shrunk about its feet (≈ the ground line), so the smaller subject
           still stands on the ground rather than floating above it. */
        <g transform={`translate(100 122) scale(${subjectScale}) translate(-100 -122)`}>
          {children}
        </g>
      )}
      <Sparkle x={36} y={38} r={5.5} tone={spark} />
      <Sparkle x={170} y={46} r={4} tone={spark} />
      <Sparkle x={30} y={100} r={4.5} tone={spark} />
    </svg>
  );
}

export default SceneFrame;
