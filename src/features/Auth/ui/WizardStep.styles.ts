// src/features/Auth/ui/WizardStep.styles.ts
//
// Shared by the three screens that make up "tell us about yourself". They are
// one form split across three steps, so they share one set of spacings.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";
import { getStyles as getButtonStates } from "../../../shared/ui/buttonStates.styles";

/** Balanced lines: no sentence leaves a single word stranded on the last. */
const description: CSSProperties = {
  display: "block",
  marginBottom: 24,
  textWrap: "balance",
};

export const styles = {
  form: { width: "100%" },
  title: { marginTop: 0, marginBottom: 4 },
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
    submitIdle: getButtonStates(token).idlePrimary,
  }) satisfies Record<string, CSSProperties>;
