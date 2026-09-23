// src/features/LoanApplication/ui/StepShared.styles.ts
//
// One set of spacings for every step of both wizards, so the six screens read
// as one form rather than six.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  form: { width: "100%" },
  /** The last field carries the form's own bottom margin. */
  actions: { marginTop: 8, marginBottom: 0, justifyContent: "flex-end" },
  block: { marginBottom: 24 },
  note: { display: "block", textWrap: "balance" },
  /** Under a section heading in the review: a hairline, not a gap. */
  reviewRule: { marginTop: 10, marginBottom: 4 },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * A quiet aside inside a step: a rule the borrower should know about.
     *
     * No box. A filled panel is the weight you give something that must be
     * dealt with — a warning, an error, a thing that stops you. This is a
     * footnote about what happens if you skip an OPTIONAL upload, and drawing
     * a container round it makes the step look like it has two subjects. The
     * icon and the grey are enough to mark it as an aside.
     */
    hint: { display: "flex", gap: 8, color: token.colorTextSecondary },
    hintIcon: { color: token.colorTextTertiary, marginTop: 3 },
  }) satisfies Record<string, CSSProperties>;
