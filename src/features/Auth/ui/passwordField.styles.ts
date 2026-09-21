// src/features/Auth/ui/passwordField.styles.ts
//
// THE DOTS, MADE READABLE — and the box, made the same height as its
// neighbours.
//
// A masked field does not draw the font's own characters, it draws the
// browser's security disc, and Montserrat's is small and sits low. At the 14px
// every other field uses, the result reads as a faint dotted rule rather than
// as a typed answer: *"ეს პაროლის გვერდზე მგონი ზედმეტად პატარაზეა ეს
// წერტილები."* A person typing a password cannot see what they typed, so the
// one feedback they get is how many marks are in the box — and it has to be
// legible.
//
// 18px with 2px between them, measured on screen rather than guessed. Bigger
// than that pushed the field out of line with the form.
//
// AND IT FIXES A SIZE BUG NOBODY HAD REPORTED. `Input.Password` wraps the input
// in an affix wrapper to hang the reveal icon on, and the wrapper was sizing
// itself off the input's own line box: 54px, against 48px for every plain field
// on the same form. Pinning the line box brings it to 49 — the last pixel is
// the eye icon's own 21px, which floors the wrapper and is not worth chasing.
//
// APPLIED AS `styles={{ input: passwordField }}`, NOT `style=`. `Input.Password`
// is an affix wrapper — it has the reveal icon to hang on — and a plain `style`
// lands on that wrapper, where `height: 22` collapses the real input to nothing
// and the dots vanish altogether. antd's semantic `styles.input` is what reaches
// the element that draws them.
//
// Per usage rather than centrally, because there is no antd token for a password
// input, and neither global CSS nor a second styling system is available here.

import type { CSSProperties } from "react";

/** Spread onto every `Input.Password` in the product. */
export const passwordField: CSSProperties = {
  fontSize: 18,
  letterSpacing: 2,
  /* Both, and both in px: `lineHeight` sets the line box the wrapper measures,
     `height` stops the 18px glyph growing it back. */
  lineHeight: "22px",
  height: 22,
};
