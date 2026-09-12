// src/shared/ui/HeroBackdrop.tsx
//
// The standalone-page ground: the product's soft wash, dissolving into white
// before the bottom of the window, optionally over faint graph paper.
//
// It exists for the screens that are one object on an otherwise empty page —
// the contact details, the invitation to start an application. Those pages
// have too little on them to fill a window, and dropped onto flat grey they
// read as unfinished rather than as spare. The wash gives the emptiness a
// reason to be there.
//
// Dumb: it draws a background and places whatever it is given on top.

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { theme } from "antd";
import { getStyles, styles } from "./HeroBackdrop.styles";

export type HeroBackdropProps = {
  /**
   * "plain" keeps the fill-the-window behaviour and drops the colour.
   *
   * A page can need its content centred in whatever the window has left
   * without also wanting a wash behind it — and that is a property of the
   * SECTION, not a reason for a second component that measures the same thing
   * a second way.
   */
  tone?: "wash" | "plain";
  /**
   * Sits the content in the middle of the window rather than at the top.
   *
   * For a page whose whole content is one card: at the top it looks dropped,
   * centred it looks placed. A page that fills its own height should stay at
   * the top, where reading starts.
   */
  center?: boolean;
  /** Padding above and below the content. */
  paddingBlock?: number;
  children: ReactNode;
};

export function HeroBackdrop({
  tone = "wash",
  center = false,
  paddingBlock = 88,
  children,
}: HeroBackdropProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);
  /**
   * The wash always comes with its graph paper.
   *
   * The two were built side by side behind a dev switch so they could be
   * compared on real pages rather than argued about; the ruled one won, so
   * the switch and the plain variant are gone rather than left in the way.
   */
  const washed = tone === "wash";
  const ref = useRef<HTMLDivElement>(null);

  /**
   * How much of the window is above this section, measured rather than assumed.
   *
   * `100vh - HEADER_HEIGHT` is only right when the top bar is the ONLY thing
   * above it. It is not: the DevBar sits there in development, and the page
   * ends up taller than the window by exactly that bar — which shows as a
   * strip of bare page under a backdrop that was supposed to reach the bottom,
   * plus a scrollbar on a screen with nothing to scroll. Measuring the
   * section's own top makes it fill what is actually left, whatever is above.
   */
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () =>
      setOffset(element.getBoundingClientRect().top + window.scrollY);

    measure();

    /**
     * Re-measured whenever the page's layout changes, not just on resize.
     *
     * Measuring once on mount is not enough: anything that appears ABOVE this
     * section afterwards — the DevBar, a banner, a font finishing loading —
     * pushes it down without the window changing size, and the section keeps
     * reserving the height it needed before. That showed as a strip of bare
     * page under a backdrop that was supposed to reach the bottom.
     */
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...s.hero,
        ...(washed ? null : styles.plain),
        minHeight: `calc(100vh - ${offset}px)`,
        alignItems: center ? "center" : "flex-start",
        paddingBlock,
      }}
    >
      {washed ? <div style={{ ...styles.grid, ...s.gridRule }} /> : null}
      <div style={styles.content}>{children}</div>

    </div>
  );
}

export default HeroBackdrop;
