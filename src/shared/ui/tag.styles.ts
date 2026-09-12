// src/shared/ui/tag.styles.ts
//
// Tags inside tables are pills.
//
// A 6px-radius chip next to 40px-tall controls reads as a small box with the
// corners knocked off. Fully rounding it makes it a label — which is what a
// role or a status is — and it is the shape the wireframes draw.

import type { CSSProperties } from "react";

/** Fully rounded, with enough side padding that the word isn't pinched. */
export const pill: CSSProperties = { borderRadius: 999, paddingInline: 10 };
