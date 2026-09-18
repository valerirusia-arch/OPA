// src/features/Auth/ui/GreetingSparkle.tsx
//
// The greeting's mark, in place of the yellow waving-hand emoji.
//
// A full-colour emoji is the heaviest, least on-brand glyph on an otherwise
// monochrome, blue-accented page — *"შეგეცვალა ყვითელი ემოჯი რამე უფრო
// კრეატიულით და უფრო ესთეტიურით."* This is a pair of four-point sparkles in the
// LOGO'S own periwinkle, so the greeting nods to the wordmark above it, with a
// slow twinkle for the same touch of life the wave gave — one of the app's own
// drawings rather than a system emoji.
//
// An SVG illustration, the sanctioned exception to antd-only: antd has no
// illustration primitive, and the colour comes from the theme.

import { brand } from "../../../theme/tokens";
import { styles } from "./GreetingSparkle.styles";

export function GreetingSparkle() {
  return (
    <svg
      viewBox="0 0 36 32"
      fill="none"
      role="presentation"
      aria-hidden="true"
      style={styles.root}
    >
      {/* The main sparkle: a four-point star with pinched, concave sides. */}
      <path
        d="M13 5 C13 15.4 15.6 18 26 18 C15.6 18 13 20.6 13 31 C13 20.6 10.4 18 0 18 C10.4 18 13 15.4 13 5 Z"
        fill={brand.logo}
        style={styles.main}
      />
      {/* A smaller one, up and to the right. */}
      <path
        d="M28 2 C28 6.8 29.2 8 34 8 C29.2 8 28 9.2 28 14 C28 9.2 26.8 8 22 8 C26.8 8 28 6.8 28 2 Z"
        fill={brand.logo}
        style={styles.small}
      />
    </svg>
  );
}

export default GreetingSparkle;
