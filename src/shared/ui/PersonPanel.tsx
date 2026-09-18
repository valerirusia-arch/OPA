// src/shared/ui/PersonPanel.tsx
//
// A PERSON ATTACHED TO AN APPLICATION, drawn the same way wherever they appear.
//
// The wizard drew one when a co-borrower had been invited — their name, the
// address the invitation went to and when it expires, with the invitation's
// state at the far edge. The underwriting screen drew the same person as a
// titled card with a four-cell record grid, so the co-borrower looked like one
// more section of the application rather than like somebody attached to it.
//
// One drawing, two tones: *"კაი იქნებოდა როგორც აპლიკაციაშია, მაგ სტილის რომ
// იყოს — ოღონდ ლურჯი არ სჭირდება, ნაცრისფერი ბექგრაუნდი სტროუკის გარეშე."*
//
//   `selected` — the wizard's. The co-borrower you PICKED, tinted the way antd
//                tints a chosen row, with the matching border so the shape has
//                an edge on white.
//   `quiet`    — the back office's. Nobody chose anything here; it is a fact
//                about the application, so it takes the product's recessed
//                fill and no edge at all.
//
// Dumb: a name, a line under it, and whatever the caller puts at the end.

import type { ReactNode } from "react";
import { Flex, Typography, theme } from "antd";
import { getStyles, styles } from "./PersonPanel.styles";

export type PersonPanelProps = {
  name: string;
  /** The line under the name: an address, a phone, a state, an expiry. */
  meta?: ReactNode;
  /** The far edge — a status, a tag. Omitted, the name takes the width. */
  trailing?: ReactNode;
  tone?: "selected" | "quiet";
};

export function PersonPanel({ name, meta, trailing, tone = "quiet" }: PersonPanelProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      style={tone === "selected" ? s.selected : s.quiet}
    >
      <Flex vertical style={styles.words}>
        <Typography.Text strong style={styles.name}>
          {name}
        </Typography.Text>
        {meta ? (
          <Typography.Text type="secondary" style={styles.meta}>
            {meta}
          </Typography.Text>
        ) : null}
      </Flex>
      {trailing}
    </Flex>
  );
}

export default PersonPanel;
