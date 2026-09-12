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

FIRST VIEWPORT: greeting and one status line, then three bands. (1) Four
light cards in a row — label, figure, hint, a mark at the label's size and a
chevron; they were the same four with 40px grey icon chips on a 148px floor,
which the designer called visually heavy. (2) The money across the page: the
36px answer with the account's state as a pill on its label line, the primary
action, and four small figures under a rule. (3) Half and half: the journey
tracker left, the dated "What happens next" right.

THE TRACKER IS A VERTICAL TIMELINE, not a horizontal stepper. antd's `Steps`
across a 1216 column is four small labels adrift on three enormous connectors;
the designer rejected both the width and the pattern. Down the page it is
indifferent to width, it has room beside each step for the line saying what
that step is waiting on, and reading order is time order. A tick behind you, a
ring with a dot where you are, an empty ring ahead.

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
