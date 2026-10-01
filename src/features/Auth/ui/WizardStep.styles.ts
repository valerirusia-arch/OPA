// src/features/Auth/ui/WizardStep.styles.ts
//
// Shared by the three screens that make up "tell us about yourself". They are
// one form split across three steps, so they share one set of spacings.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { brand } from "../../../theme/tokens";

/** Balanced lines: no sentence leaves a single word stranded on the last. */
const description: CSSProperties = {
  display: "block",
  marginBottom: 24,
  textWrap: "balance",
};

export const styles = {
  form: { width: "100%" },
  /**
   * SANS, not the page-title serif. These step headings are `Title level={2}`,
   * which index.html binds to Playfair — but a level-2 is a PAGE title and these
   * sit INSIDE the registration card, where the project's own rule already wants
   * the sans (see the note in index.html: serif is for page titles, never inside
   * a container). Overriding the family here drops the serif, and the size comes
   * down 4px from the level-2 default (30 → 26) — a page-title size read too big
   * inside the card — while the weight stays. *"რეგისტრაციის კონტეინერში ეს
   * სტილის თაითლი არ უნდა იყოს… 4 პიქსელით დააპატარავე."*
   */
  title: { marginTop: 0, marginBottom: 4, fontFamily: brand.fontSans, fontSize: 26 },
  description,
  /**
   * The contact step's subtitle is the long one. Sized so it breaks after
   * "decides" and the second line reads "what we can offer you." — balancing
   * is off here, since it would even the lines out and undo that break.
   */
  descriptionLong: { ...description, maxWidth: 610, textWrap: "wrap" },
  alert: { marginBottom: 16 },
  /** Back sits next to Continue, not under it — one row, no hunting. */
  actions: { marginTop: 8, marginBottom: 0 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /** The "why do you need this?" marker inside a field. */
    hintIcon: { color: token.colorTextTertiary },
  }) satisfies Record<string, CSSProperties>;
