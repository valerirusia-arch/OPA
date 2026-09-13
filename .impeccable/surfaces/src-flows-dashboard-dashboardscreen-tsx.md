---
version: 1
slug: "src-flows-dashboard-dashboardscreen-tsx"
primary_target: "src/flows/dashboard/DashboardScreen.tsx"
related_targets: ["src/features/Dashboard/ui/NextSteps.tsx"]
---

## Scope

`/dashboard` — the borrower's and co-borrower's landing page. Visitor mode:
**Operate**. Related: the loan, payments and application pages it is made of.

## Audience and job

Somebody who could not cover a USCIS filing fee, opening the app between
events. Their questions, in order: what is happening, is anything required of
me, what is the state of my money, and when does the next thing happen.

## Direction contract

THESIS: a lending dashboard whose job is TIMING, not metrics. It refuses the
metric-wall arrangement — four KPI cards and a chart — because this product has
one loan, one schedule and one set of deadlines, and the borrower's anxiety is
never "how much" but "when, and what if I am late".

OWN-WORLD: the incumbent product's, unchanged. antd on the theme's tokens,
white cards on the page ground, 11px uppercase micro-labels over tabular
figures, one accent, hand-drawn SVG marks for empty states. Recognizable with
the content removed by the label-over-figure pairing and the 24px band rhythm.

STORY: the reader sees where their application or loan stands, what it costs
them, and a dated list of what is coming — then leaves for the page that acts.

FIRST VIEWPORT: greeting and one status line, then two bands. (1) The wide
band, which is one of two things depending on the phase and never both. Before
funding it is the APPLICATION TRACK: a five-step rail across the full width —
Submitted, Reviewed, Signed, Funded, Repaid — then a hairline, then the live
step with what is happening and why on the left and its one action on the
right. After funding it is the money: the 46px answer with the account's state
as a pill on its label line, and four small figures under a rule. (2) Four
light cards in a row — label, figure, hint, a mark at the label's size and a
chevron.

THE TRACKER IS A FULL-WIDTH HORIZONTAL RAIL. This brief said the opposite —
"a vertical timeline, not a horizontal stepper" — and the designer reversed it
in their own words: *"ზემოთ ჩასვავ ტრეკერს აპლიკაციის სტეპებზე, მთლიანად
სიგრძეზე გაუშვებ ლამაზად, ქვემოთ იქნება იმ კონკრეტულ სტეპზე ინფორმაცია."*
What had failed before was not the direction but the width it was given: four
steps across a half-column is four labels adrift on three connectors, while
five across 1216 is a step every 243px. Two variants are in the tree and are
being COMPARED, not kept — `nodes` (numbered discs on a continuous rail, tick
behind, caret over the live one) and `bars` (five capsules with their label and
date above, the live one half filled). The dev dock carries the switch; one of
the two is deleted when the designer picks.

THE BAND'S OLD PREMISE IS GONE. It stated APPLIED FOR, the amount, the
reference and the USCIS service — *"დაივიწყე ამ კონტენერის ეს არსი"*. The
amount is on the tile directly below it, the other two are on /application,
and none of the four answers what a borrower opens this page to find out.

NO BANNER. The delinquency notice was a full-width alert above the money
carrying three sentences of policy. The STATE is now a pill on the balance's
own label line and the past-due amount is a figure in its strip; the RULE
stays in "What happens next", dated, in the WBS's words.

FORM: the designer's own wireframe (Figma 98:5518), kept band for band, with
its explicitly empty panel filled and its four label-only tiles given figures.
No seed key — a wireframe-pinned composition, not an open surface.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Unresolved

- **The dashboard is not in the WBS.** "Dashboard" appears nowhere in it. The
  page composes existing stories and invents no capability; it is the
  designer's, and OPA has not been asked.
- The staff rail's own Dashboard entry is a separate wireframe (Figma 92:4714)
  and is not built.
