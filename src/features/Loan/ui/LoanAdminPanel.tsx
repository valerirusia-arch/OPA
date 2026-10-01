// src/features/Loan/ui/LoanAdminPanel.tsx
//
// The comments an authorised user has left on a loan. WBS story 11 —
// "Authorized users shall be able to manually update loan details (add
// documents, comments)."
//
// It used to hold the documents too, and no longer does: the internal
// wireframe gives them their own card with columns this list cannot carry
// (who uploaded it, what was said about it), so they moved to
// LoanDocumentsTable and this is the other half.
//
// Append-only. The story says ADD, not edit and not delete: a comment somebody
// can quietly rewrite is not a record of anything, so there is no pencil next
// to one. Adding happens in the one dialog the wireframe draws, which is the
// page's business rather than this panel's.
//
// Dumb: it renders comments it is given.

import { Divider, Flex, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { getStyles, styles } from "./LoanAdminPanel.styles";
import type { LoanComment } from "./types";

export type LoanAdminPanelProps = {
  comments: LoanComment[];
};

export function LoanAdminPanel({ comments }: LoanAdminPanelProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    <Flex vertical>
      <Typography.Text style={s.sectionTitle}>{t("loanAdmin.comments")}</Typography.Text>

      {comments.length === 0 ? (
        <EmptyState
          title={t("loanAdmin.noComments")}
        />
      ) : (
        <Flex vertical style={styles.list}>
          {comments.map((comment, index) => (
            <Flex vertical key={comment.id}>
              {index > 0 ? <Divider style={styles.rule} /> : null}
              <Flex vertical style={styles.comment}>
                <Typography.Text type="secondary" style={styles.meta}>
                  {comment.on} · {comment.by}
                </Typography.Text>
                <Typography.Text>{comment.text}</Typography.Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export default LoanAdminPanel;
