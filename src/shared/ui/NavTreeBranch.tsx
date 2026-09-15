// src/shared/ui/NavTreeBranch.tsx
//
// The tree connector for a nested nav item, in its own module so Fast Refresh
// treats it as a component in a file that only exports components.
//
// Each child carries a rounded elbow that branches off a vertical rail to its
// label; a non-last child continues the rail down to the next elbow, and the
// last child's elbow closes it. The rail is drawn INSIDE the label (shifted
// left with a negative margin the padding gives back), because antd owns the
// submenu's own DOM. Geometry is tuned to the inline item: 40px tall on a 42px
// pitch, so each 21px half-segment meets the next exactly and the rail reads as
// one continuous line.

import type { ReactNode } from "react";

const W = 1.5;
const HALF = 21;
const RAIL = 14;
const TICK = 11;
const X = 1;

export function NavTreeBranch({
  isLast,
  color,
  children,
}: {
  isLast: boolean;
  color: string;
  children: ReactNode;
}) {
  const line = `${W}px solid ${color}`;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        marginInlineStart: -RAIL,
        paddingInlineStart: RAIL,
      }}
    >
      {/* Rounded elbow: the rail's top half plus the branch to the label. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: X,
          top: `calc(50% - ${HALF}px)`,
          width: TICK,
          height: HALF,
          borderLeft: line,
          borderBottom: line,
          borderBottomLeftRadius: 8,
        }}
      />
      {/* The rail's bottom half, carrying it on to the next child. */}
      {!isLast ? (
        <span
          aria-hidden
          style={{ position: "absolute", left: X, top: "50%", height: HALF, borderLeft: line }}
        />
      ) : null}
      {children}
    </span>
  );
}

export default NavTreeBranch;
