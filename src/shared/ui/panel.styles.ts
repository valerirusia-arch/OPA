// src/shared/ui/panel.styles.ts
//
// THE INSET OF A PAGE'S LEAD CARD, defined once.
//
// This product has two card insets and the difference is meant to carry
// meaning: 24 is an ordinary card, 32 is the one card a page is FOR. It is
// most of what makes the loan page's statement read as its headline — "it
// comes first, it holds the only figureLg on the page, and it has more air
// inside it than anything below it".
//
// The rule was written down in LoanStatement and nowhere else, so only
// LoanStatement obeyed it. The balance card, which is the lead of /payments
// and of the dashboard, sat in a plain antd Card at 24 — the same figure, the
// same label, the same caption, at two different distances from two different
// card edges. The designer put the two crops side by side and asked the
// obvious question: *"სფეისინგი და დაშორებები კონტენერიდან სხვადასხვაა
// რატომ? ერთნაირი უნდა იყოს, ლოანზე როგორც არის."*
//
// So the value lives here and every lead panel reads it. A card that is not
// its page's answer keeps antd's own 24 and says nothing.

import type { CSSProperties } from "react";

/** The lead card's body. Apply as `styles={{ body: leadPanelBody }}`. */
export const leadPanelBody: CSSProperties = { padding: 32 };

/** The same inset as a number, for the handful of places that have to
 *  position something against it — a pinned corner action, a caret that
 *  hangs above the content it marks. */
export const LEAD_PANEL_INSET = 32;
