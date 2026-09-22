// src/features/Auth/ui/PasswordField.styles.ts

import type { CSSProperties } from "react";

/**
 * The masked state only — see the note at the top of PasswordField.
 *
 * 18px with 2px between the discs, measured on screen rather than guessed:
 * bigger pushed the field out of line with the form.
 *
 * THE LINE BOX IS 19px, AND THAT NUMBER IS LOAD-BEARING. The affix wrapper
 * sizes itself off the input's line box, so this decides the height of the
 * whole field. At 22 the box stood 49px — one pixel taller than the same field
 * revealed, and one taller than every other field on the form, so toggling the
 * eye made it twitch: *"როცა პაროლს ვაჩენ ინფუთი სიგრძეში მოკლდება, როცა
 * ვმალავ იზრდება."* At 19 the box is 48 in both states and matches its
 * neighbours exactly. (20 lands on 48.13, which rounds to a visible seam.)
 *
 * Reaches the real input through antd's semantic `styles.input`. A plain
 * `style` on Input.Password lands on the affix wrapper instead, where the
 * pinned height collapses the input to zero and the discs vanish altogether.
 */
export const maskedText: CSSProperties = {
  fontSize: 18,
  letterSpacing: 2,
  lineHeight: "19px",
  height: 19,
};
