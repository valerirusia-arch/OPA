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
  "M44 48C54 26 82 16 110 22C138 28 162 44 164 70C166 96 144 114 114 118" +
  "C84 122 50 114 42 92C36 76 38 62 44 48Z";

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

export type SceneFrameProps = {
  /** Rendered width in px; the height follows the box. */
  width: number;
  /** The blob and the ground. */
  blob: string;
  /** The sparkles. */
  spark: string;
  /** The subject, drawn between the blob and the ground. */
  children: ReactNode;
};

export function SceneFrame({ width, blob, spark, children }: SceneFrameProps) {
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
      {children}
      {/* The ground is last of the solids: a flat ellipse, no blur, so the
          subject stands on the page without being lit by anything. */}
      <ellipse cx={96} cy={132} rx={54} ry={4} fill={blob} />
      <Sparkle x={36} y={38} r={5.5} tone={spark} />
      <Sparkle x={170} y={46} r={4} tone={spark} />
      <Sparkle x={30} y={100} r={4.5} tone={spark} />
    </svg>
  );
}

export default SceneFrame;
