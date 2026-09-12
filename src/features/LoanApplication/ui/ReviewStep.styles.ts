// src/features/LoanApplication/ui/ReviewStep.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const styles = {
  /** Label left, answer right — the answers line up down one edge to scan. */
  row: { paddingBlock: 6 },
  label: { minWidth: 0 },
  value: { textAlign: "end", fontVariantNumeric: "tabular-nums" },
  /**
   * A row whose value needs no label — "Nobody invited", "Signed on…".
   *
   * Repeating the section's own name as the label of its only row ("Co-borrower
   * / Co-borrower / None") is noise the reader has to step over. It reads at
   * the same weight as every other answer; being alone is what sets it apart.
   */
  soleValue: {},
  edit: { paddingInline: 0, flex: "none" },
} satisfies Record<string, CSSProperties>;

export const getStyles = (token: GlobalToken) =>
  ({
    /**
     * ONE card with hairline-separated sections, not six bordered boxes.
     *
     * Six framed blocks gave six equal objects and a lot of chrome — two
     * borders and a rule between every group — for what is really one list of
     * answers. The frame was doing separation the whitespace already does, and
     * the reader had to get past it before reaching the first figure.
     */
    section: { paddingBlock: token.padding },
    rule: { marginBlock: 0 },
    /**
     * The section's name at reading size, in full text colour.
     *
     * It was tried as an 11px uppercase caption in tertiary grey and that made
     * it quieter than the answers underneath it — the page read as one long
     * list and the reader had to work out where each group began.
     */
    sectionTitle: { fontWeight: 500 },
    /**
     * The amount is the one number being agreed to, so it is the one number
     * set apart. Everything else on the page is a fact about the applicant.
     */
    amount: { fontSize: 18, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  }) satisfies Record<string, CSSProperties>;
