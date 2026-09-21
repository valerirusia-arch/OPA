// src/features/Auth/ui/PasswordField.styles.ts

import type { CSSProperties } from "react";

/**
 * The masked state only — see the note at the top of PasswordField.
 *
 * 18px with 2px between the discs, measured on screen rather than guessed:
 * bigger pushed the field out of line with the form. Both line values are
 * pinned because the affix wrapper sizes itself off the input's line box, and
 * without them the password box stood 54px tall on a form where every other
 * field is 48. It measures 49 now; the last pixel is the reveal icon's own
 * 21px, which floors the wrapper and is not worth chasing.
 *
 * Reaches the real input through antd's semantic `styles.input`. A plain
 * `style` on Input.Password lands on the affix wrapper instead, where the
 * pinned height collapses the input to zero and the discs vanish altogether.
 */
export const maskedText: CSSProperties = {
  fontSize: 18,
  letterSpacing: 2,
  lineHeight: "22px",
  height: 22,
};
