// src/features/LoanApplication/ui/ExternalPanel.tsx
//
// A region of the page that belongs to somebody other than OPA.
//
// Two of this epic's steps hand off to a third party, and the WBS says so in
// terms that matter legally as much as visually:
//   - signing is DocuSign's, and OPA cannot change what is in the documents;
//   - the card form is Repay's "black box", and OPA stores only a token.
//
// Presenting either in OPA's own field styling would tell the borrower they
// are giving their card number to OPA. They are not. So the company is named
// at the head of the panel, and the line that says what happens to the data
// sits directly ABOVE the button that starts it — read, then act. Printed
// underneath, as it was, the borrower met the button first and found out where
// it led afterwards.
//
// Dumb: a frame, a name, a sentence and whatever action it is given.

import type { ReactNode } from "react";
import { Flex, Typography, theme } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { getStyles, styles } from "./ExternalPanel.styles";

export type ExternalPanelProps = {
  /** The company whose system this is — "DocuSign", "Repay". */
  provider: string;
  /** What happens to what is entered here. */
  note: string;
  children: ReactNode;
};

export function ExternalPanel({ provider, note, children }: ExternalPanelProps) {
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <div style={s.panel}>
      <Flex align="center" gap={12} style={s.header}>
        <Flex align="center" justify="center" style={s.chip}>
          <LockOutlined />
        </Flex>
        <Typography.Text style={styles.provider}>{provider}</Typography.Text>
      </Flex>

      <Flex vertical gap={20} style={s.body}>
        <Typography.Text type="secondary" style={styles.note}>
          {note}
        </Typography.Text>
        {/* A row, so a button keeps its own width instead of stretching to
            the panel and a done-state can lay itself out however it likes.
            `stretch`, so a child that DOES want the full width — the signature
            field and its button — gets it, instead of sitting narrower than
            the panel on one side. */}
        <Flex wrap gap={12} align="stretch" style={styles.row}>
          {children}
        </Flex>
      </Flex>
    </div>
  );
}

export default ExternalPanel;
