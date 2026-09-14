// src/shared/ui/Logo.tsx
//
// THE OPA WORDMARK.
//
// Three letters that overlap, and the overlap darkens. The designer's own
// note on the sheet says what it is for: *"სამი მონაწილე, ერთი ვალდებულება"*
// — three participants, one obligation. On this product that is exact: a
// borrower, a co-borrower and OPA sign one agreement, and what they share is
// the part where they overlap.
//
// THE LETTERFORMS ARE THE REAL ONES. They are not drawn by hand and not set
// in a webfont — they were lifted as vector outlines out of the designer's
// own PDF, which stored them as Type3 glyph procedures. Recomposed at the
// sheet's own spec (10% overlap, -0.02em tracking) they measure 2.382:1
// against the artwork's 2.361:1, which is under one percent.
//
// Lifting them rather than loading Gabarito matters three times over: this
// project has no font loading at all and adding it means editing index.html,
// which is outside what Design Mode may touch; a logo that waits on a CDN
// flashes or disappears when the CDN is blocked; and an outline takes the
// theme's colour at paint time.
//
// ONE BLUE, AND IT IS THE PRODUCT'S. The sheet draws the mark in #446FEB and
// this draws it in `colorPrimary`, #2456E6. Two blues twenty units apart —
// a logo beside a primary button — read as a mistake rather than as a
// palette. If the brand blue is meant to be the sheet's, that is one value in
// tokens.ts and the mark follows it.
//
// The darkening is multiply, the same as the artwork, rather than a third
// hard-coded colour for the intersections: change the token and the overlaps
// re-derive themselves.

import { theme } from "antd";
import { getStyles, styles } from "./Logo.styles";

export type LogoProps = {
  /** Rendered height in px. The width follows the mark's own ratio. */
  height?: number;
};

/* The glyphs sit on a 1000-unit em with the baseline at 0, exactly as they
   came out of the PDF. The box is the composed ink: 1689 wide by 709 tall,
   the 709 being cap height plus the O's overshoot above and below. */
const VIEW_W = 1689;
const VIEW_H = 709;
/** Where each letter lands, from the sheet: 10% overlap, -0.02em tracking. */
const PLACE = { O: -14, P: 591, A: 1044 };
/** Lifts the baseline-anchored outlines into the box. */
const BASELINE = 695;

const GLYPHS: { key: keyof typeof PLACE; d: string }[] = [
  { key: "O", d: "M14.0 -340.0C14.0 -392.0 22.3 -439.7 39.0 -483.0C55.7 -526.3 79.3 -563.8 110.0 -595.5C140.7 -627.2 177.3 -651.7 220.0 -669.0C262.7 -686.3 310.0 -695.0 362.0 -695.0C414.0 -695.0 461.5 -686.3 504.5 -669.0C547.5 -651.7 584.5 -627.2 615.5 -595.5C646.5 -563.8 670.3 -526.3 687.0 -483.0C703.7 -439.7 712.0 -392.0 712.0 -340.0C712.0 -288.0 703.7 -240.3 687.0 -197.0C670.3 -153.7 646.5 -116.2 615.5 -84.5C584.5 -52.8 547.5 -28.5 504.5 -11.5C461.5 5.5 414.0 14.0 362.0 14.0C310.0 14.0 262.7 5.5 220.0 -11.5C177.3 -28.5 140.7 -52.8 110.0 -84.5C79.3 -116.2 55.7 -153.7 39.0 -197.0C22.3 -240.3 14.0 -288.0 14.0 -340.0ZM199.0 -340.0C199.0 -302.7 205.8 -271.0 219.5 -245.0C233.2 -219.0 252.3 -199.3 277.0 -186.0C301.7 -172.7 330.0 -166.0 362.0 -166.0C394.7 -166.0 423.3 -172.7 448.0 -186.0C472.7 -199.3 492.0 -219.2 506.0 -245.5C520.0 -271.8 527.0 -303.7 527.0 -341.0C527.0 -378.3 520.0 -410.0 506.0 -436.0C492.0 -462.0 472.7 -481.7 448.0 -495.0C423.3 -508.3 394.7 -515.0 362.0 -515.0C330.0 -515.0 301.7 -508.2 277.0 -494.5C252.3 -480.8 233.2 -461.0 219.5 -435.0C205.8 -409.0 199.0 -377.3 199.0 -340.0Z" },
  { key: "P", d: "M179.0 -340.0L287.0 -340.0C317.7 -340.0 340.8 -347.0 356.5 -361.0C372.2 -375.0 380.0 -395.3 380.0 -422.0C380.0 -449.3 372.2 -470.0 356.5 -484.0C340.8 -498.0 317.7 -505.0 287.0 -505.0L178.0 -505.0L222.0 -544.0L222.0 0.0L41.0 0.0L41.0 -681.0L293.0 -681.0C347.0 -681.0 394.3 -671.2 435.0 -651.5C475.7 -631.8 507.3 -602.8 530.0 -564.5C552.7 -526.2 564.0 -478.7 564.0 -422.0C564.0 -365.3 552.7 -317.8 530.0 -279.5C507.3 -241.2 475.7 -212.2 435.0 -192.5C394.3 -172.8 347.0 -163.0 293.0 -163.0L179.0 -163.0L179.0 -340.0Z" },
  { key: "A", d: "M169.0 -269.0L454.0 -269.0L454.0 -102.0L169.0 -102.0L169.0 -269.0ZM4.0 0.0L245.0 -681.0L426.0 -681.0L645.0 0.0L463.0 0.0L300.0 -558.0L372.0 -558.0L185.0 0.0L4.0 0.0Z" },
];

export function Logo({ height = 28 }: LogoProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <svg
      height={height}
      viewBox={"0 0 " + VIEW_W + " " + VIEW_H}
      fill="none"
      role="img"
      aria-label="OPA"
      style={styles.mark}
    >
      {GLYPHS.map((glyph) => (
        <path
          key={glyph.key}
          d={glyph.d}
          transform={"translate(" + PLACE[glyph.key] + " " + BASELINE + ")"}
          style={s.letter}
        />
      ))}
    </svg>
  );
}

export default Logo;
