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
// THE MEASURE IS 520. It went 420 -> 480 -> 520, each time for the same
// reason: a short sentence in a narrow column reads as more text than it is.
// 520 is roughly 70 characters, still inside a comfortable measure, and it is
// what lets "…at the moment. Contact OPA support" finish its clause before
// the line turns — *"ეს ცოტა გაშალე"*.
//
// AND THE WRAP IS `pretty`, NOT `balance`. Balance evens the two lines, which
// sounds right and reads wrong here: it broke "Nothing has been refused. It
// carries / on by itself…" in the middle of a clause purely to make the
// halves the same length. `pretty` fills the line and only intervenes to stop
// a last line holding one word — which was the original complaint that put
// `balance` here ("…show you what OPA can / cover."), and the part worth
// keeping. Where it is unsupported both fall back to an ordinary greedy wrap.
//
// A SENTENCE WHOSE BREAK REALLY MATTERS DOES NOT ARGUE WITH THE WIDTH — it is
// written as two blocks (see `subLine` in ApplicationGate), because no single
// measure can be right for every string, and the Spanish runs a third longer
// than the English anyway.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../theme/tokens";

/**
 * `empty` opts apply to the asset-illustration empty states (loan, payments):
 * their drawing is cropped tight to the shadow, so the title sits 24 below it
 * and the sentence takes the caption grey. The title keeps antd Result's own
 * size and weight (24px, regular) — the dashboard empty is matched to it. The
 * gate (journey scenes, not cropped) calls this with no opts.
 */
export const getPageResultStyles = (token: GlobalToken, opts?: { empty?: boolean }) =>
  ({
    title: {
      marginTop: opts?.empty ? 24 : token.margin,
    },
    subTitle: {
      maxWidth: 520,
      marginInline: "auto",
      marginTop: token.marginXS,
      textWrap: "pretty",
      ...(opts?.empty ? { color: brand.sceneCaption } : {}),
    },
    extra: { marginTop: token.marginLG },
  }) satisfies Record<string, CSSProperties>;
