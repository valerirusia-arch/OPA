// src/shared/ui/pageResult.styles.ts
//
// HOW A PAGE-SIZED `Result` IS SET — the drawing, a heading, one sentence and
// the way forward, on a page that has nothing else on it.
//
// Shared because there are several of these and they are the same moment seen
// from different pages: the application gate's dozen states, the loan page
// with no loan, the payments page with no schedule. The gate had these values
// and the other two had none, so their sentences ran the full width of the
// card — a single line across a 900px page, which reads as a banner rather
// than as a sentence: *"საბთაითლები ჩამოდროპე, ცოტა ძაან გაშლილადაა."*
//
// THE MEASURE IS 480. 420 held these to three lines where two would do — a
// short sentence in a narrow column reads as more text than it is. 480 is
// still well inside a comfortable measure, roughly 60 characters.
//
// AND THE LINES ARE BALANCED, not ragged. One of the gate's sentences broke as
// "…show you what OPA can / cover." — one word alone on the second line, the
// kind of break a reader notices instead of reading. `text-wrap: balance` is
// the fix rather than a narrower width or a hand-placed break: the browser
// evens the lines itself, so it holds for every sentence here and for the
// Spanish that runs a third longer, neither of which a width tuned to one
// English string would survive. Where it is unsupported it falls back to an
// ordinary greedy wrap, which is what these had before.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const getPageResultStyles = (token: GlobalToken) =>
  ({
    title: { marginTop: token.margin },
    subTitle: {
      maxWidth: 480,
      marginInline: "auto",
      marginTop: token.marginXS,
      textWrap: "balance",
    },
    extra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
