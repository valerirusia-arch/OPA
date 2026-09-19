// src/shared/ui/tag.styles.ts
//
// Tags inside tables are pills.
//
// A 6px-radius chip next to 40px-tall controls reads as a small box with the
// corners knocked off. Fully rounding it makes it a label — which is what a
// role or a status is — and it is the shape the wireframes draw.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

/** Fully rounded, with enough side padding that the word isn't pinched. */
export const pill: CSSProperties = { borderRadius: 999, paddingInline: 10 };

/**
 * A NEUTRAL LABEL TAG — a document type, a role, the step that flagged a row.
 *
 * NOT a status: those are `StatusPill`, with a dot. This is a word in a box,
 * and the box has one job — to say the word is a value from a closed set
 * rather than free text.
 *
 * WHITE, WITH THE PRODUCT'S HAIRLINE. antd gives a colourless Tag `defaultBg`,
 * which on this warm palette composites to a cream slab: a faint warm smudge
 * on a white row, and the moment the row is hovered and takes the light blue
 * tint, a dirty patch sitting on top of it with the word going muddy inside.
 * White reads the same on both grounds, and the hairline keeps it a shape once
 * the fill stops doing that job — the same pair the status pills settled on.
 */
export const labelTag = (token: GlobalToken): CSSProperties => ({
  ...pill,
  background: token.colorBgContainer,
  border: `1px solid ${token.colorSplit}`,
});
