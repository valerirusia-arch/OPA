// src/features/LoanApplication/ui/IncomeStep.styles.ts

import type { CSSProperties } from "react";

export const styles = {
  /**
   * A row tall enough to hold its own remove button.
   *
   * antd draws the uploaded file as a 22px line of text and puts a 36px icon
   * button at the end of it. The button's hover square is then taller than the
   * row it belongs to and flush with its right edge, so hovering the file
   * paints a grey square that hangs out of the row above, below and at the
   * side — it reads as clipped, and it is the one control on the row somebody
   * actually has to aim at.
   *
   * 40px clears the button with a hair to spare, and the 4px inset keeps its
   * square inside the row's own rounded edge.
   */
  uploadItem: { minHeight: 40, paddingInline: 4 },
} satisfies Record<string, CSSProperties>;
