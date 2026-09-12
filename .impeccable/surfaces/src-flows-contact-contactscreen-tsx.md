---
version: 1
slug: "src-flows-contact-contactscreen-tsx"
primary_target: "src/flows/contact/ContactScreen.tsx"
related_targets: []
---

## Scope

`/contact` — the borrower's and co-borrower's support page. Visitor mode:
**Read**. WBS Epic 3 story 8: a static page of support contact details,
"information only, no interactive elements".

## Audience and job

Somebody mid-way through a USCIS filing that OPA is lending against, who has
opened this page because something is worrying them. Their job is to reach a
person. Nothing on the page is pressable; the page's whole value is how fast
the right fact is found.

## Direction contract

THESIS: a support page whose subject is REACHING A PERSON, not listing four
contact facts. It refuses the four-equal-cards arrangement because three of
those four are not peers — opening hours is an attribute of the phone line,
and a postal address is a different errand from asking a question.

OWN-WORLD: the product's, unchanged and deliberately so. antd on the theme
tokens, white cards on the `#F4F5FA` ground, 11px uppercase micro-labels over
tabular figures, one accent, the hand-drawn SVG mark family. No new size, face
or colour was introduced; `figureLg`, `figure` and `microLabel` are the same
ones /loan and /payments use.

STORY: the reader sees the number first, learns in the same glance whether
anyone is on the line right now, and leaves. Email is there for what can wait.
The postal address is there because documents go by post.

FIRST VIEWPORT: left-aligned title and one line, matching every other screen.
Then a two-up band, 14/10 — Call carrying the number at headline size with the
support mark, a hairline, then the staffed/closed pill beside the hours; Email
carrying the address one size down with its own hairline and note. Then one
quiet full-width row for the mailing address. No primary action exists on this
page by instruction.

FORM: derived, not dealt — the surface round was served and the designer asked
for the build directly instead, keeping the visual system and freeing the
layout. Seed key 04e409f0 (surface/read) records the round that was opened.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Unresolved

- The staffed/closed state is computed from the hours already printed on the
  page, in America/New_York, and fails closed. OPA has not confirmed holidays,
  and the page makes no claim about them.
- No response-time promise appears for email: the WBS sets none and one would
  be an invented commitment.
