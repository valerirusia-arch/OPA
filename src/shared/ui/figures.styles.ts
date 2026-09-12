// src/shared/ui/figures.styles.ts
//
// The two type treatments this product repeats everywhere it states a number:
// the small uppercase label above it, and the figure itself.
//
// They were defined SEVEN times for the label and THREE times for the figure,
// at three different sizes — 28 on the metric cards, 32 on the loan page's
// next payment, 36 on the payments page's balance. Nobody chose three sizes;
// each screen picked one on its own and the pages stopped looking related,
// which is exactly what "make it consistent with the others" was pointing at.
//
// One label, and a figure scale with TWO steps and a rule for which is which:
//
//   `figure`    a number in a row of numbers — the loan page's strip, where
//               four of them share a line and none outranks the others. It is
//               set a clear step DOWN from the answer, in size and in weight:
//               these are the facts you check, not the one you came for. At
//               28/600 four of them shouted as loudly as the 36 below and the
//               page read as heavy, which is precisely what it was. At 24 they
//               then tied with the PAGE TITLE, which is its own confusion: the
//               heading and a data value cannot be the same size. 20 is the
//               step below the title and the same one the masked card number
//               is set at — one size for "a number among numbers".
//   `figureLg`  the ONE number a page exists to answer. A page gets at most
//               one: the outstanding balance on /payments, the next payment on
//               /loan. Two of these on a screen means neither is the answer.
//
// Sites add their own margins and display; what lives here is the type.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getFigureStyles = (token: GlobalToken) =>
  ({
    /**
     * The quiet uppercase label above a value.
     *
     * 11px is below the size at which letter-spacing is optional: at this
     * scale caps set solid read as a block, so the 0.04em is structural. The
     * colour is the AA-passing quiet token, not a tertiary grey.
     */
    microLabel: {
      fontSize: 11,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: token.colorTextTertiary,
    },
    /** One of several figures on a line. */
    figure: {
      fontSize: 20,
      lineHeight: 1.3,
      fontWeight: 500,
      color: token.colorText,
      /* Tabular, always. A figure that changes after a payment must not shift
         the digits beside it. */
      fontVariantNumeric: "tabular-nums",
    },
    /**
     * A value under a micro-label in a MULTI-COLUMN ROW.
     *
     * The third step, and it exists because three components were each
     * choosing their own: the loan statement's four-across facts at 15, the
     * balance card's three-across details at 14, and the dashboard's four
     * tiles at `figure`'s 20 — the last two in bands that stack, which is how
     * two different rows of label-over-value came to look like two versions
     * of one object.
     *
     * 15 rather than 16, for the reason the statement worked out first: four
     * of them share a line, and at 16 the row reads as a second headline.
     */
    rowValue: {
      fontSize: 15,
      fontWeight: 500,
      color: token.colorText,
      fontVariantNumeric: "tabular-nums",
    },
    /** The one figure a page is about. */
    figureLg: {
      fontSize: 36,
      lineHeight: 1.15,
      fontWeight: 600,
      color: token.colorText,
      fontVariantNumeric: "tabular-nums",
    },
  }) satisfies Record<string, CSSProperties>;
