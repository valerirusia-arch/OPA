// src/features/Loan/ui/SignLoanAgreement.tsx
//
// WBS story 2 — "The Borrower and Co-borrower shall be able to review and
// electronically sign all loan documents required after loan approval,
// including the Loan Agreement and other applicable disclosures BEFORE LOAN
// FUNDING."
//
// Its own screen, per the wireframe, and rightly: this is the moment the
// borrower commits to the loan, and a card halfway down the loan page is not
// where that belongs. The loan page links here.
//
// ONE CARD, NOT TWO (2026-09-11). It was the package on the left and a
// DocuSign panel on the right holding a dashed "Sign here" zone and the
// button. The designer's revision, and the WBS allows it:
//
//   · The dashed zone was the WIREFRAME's, not the WBS's. Nothing in the
//     stories asks for a signature field, and there is a good reason not to
//     draw one: the signature is not given here, it is given in DocuSign. A
//     field that cannot be signed in is a picture of the wrong thing.
//   · "Sign all" is the page's one action, so it sits in the head, where a
//     card's action goes, at a link's weight.
//   · How far through you are goes NEXT TO the bar that shows it, rather than
//     as a number in the opposite corner from its own indicator.
//
// WHAT THE WBS DOES REQUIRE, AND IS THEREFORE KEPT: DocuSign has to be named.
// The story's own note is that the documents cannot be altered there, that
// the signature is the only thing the signer provides and that the date is
// applied automatically — and PRODUCT.md's fourth principle is that where the
// flow leaves OPA, the border is visible and the company is named. Losing the
// panel does not lose that: it is the line at the foot of the card, under the
// documents it applies to.
//
// Dumb: signing flips a prop-driven state after a console.log.

import { Alert, Button, Card, Divider, Flex, Progress, Tag, Typography, theme } from "antd";
import {
  CheckCircleFilled,
  CheckOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { getStyles, styles } from "./SignLoanAgreement.styles";
import type { LoanDocument } from "./types";

export type SignLoanAgreementProps = {
  /** The package generated after approval. WBS: state and role decide it. */
  documents: LoanDocument[];
  /** Which have been signed already, by id. */
  signed?: string[];
  onSign?: (document: LoanDocument) => void;
  onSignAll?: () => void;
};

export function SignLoanAgreement({
  documents,
  signed = [],
  onSign,
  onSignAll,
}: SignLoanAgreementProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const remaining = documents.filter((document) => !signed.includes(document.id));
  const done = remaining.length === 0;
  const percent =
    documents.length === 0 ? 0 : Math.round((signed.length / documents.length) * 100);

  return (
    <Flex vertical>
      <Alert
        style={styles.banner}
        type={done ? "success" : "info"}
        showIcon
        title={t(done ? "sign.loanDoneTitle" : "sign.loanApprovedTitle")}
        description={t(done ? "sign.loanDoneBody" : "sign.loanApprovedBody")}
      />

      <Card
        title={t("sign.loanPackage")}
        styles={{ body: styles.listBody }}
        /* The page's one action, in the head. A link rather than a filled
           button: every row below carries its own way in, and this is the
           shortcut through them, not a second kind of thing. */
        extra={
          done ? null : (
            <Button type="link" style={styles.headAction} onClick={onSignAll}>
              {t("sign.signAllShort")}
            </Button>
          )
        }
      >
        {/* How far through, beside the bar that shows it. */}
        <Flex align="center" gap={16} style={styles.progressRow}>
          <Progress
            percent={percent}
            showInfo={false}
            size={{ height: 6 }}
            style={styles.progress}
          />
          <Typography.Text type="secondary" style={styles.count}>
            {t("sign.progress", {
              signed: String(signed.length),
              count: String(documents.length),
            })}
          </Typography.Text>
        </Flex>

        {documents.map((document) => {
          const isSigned = signed.includes(document.id);
          return (
            <Flex vertical key={document.id}>
              <Divider style={styles.rule} />
              <Flex
                align="center"
                justify="space-between"
                gap={16}
                wrap
                style={styles.row}
              >
                <Flex align="center" gap={12} style={styles.name}>
                  <Flex
                    align="center"
                    justify="center"
                    style={isSigned ? s.iconDone : s.icon}
                  >
                    {isSigned ? <CheckCircleFilled /> : <FileTextOutlined />}
                  </Flex>
                  <Flex vertical style={styles.nameText}>
                    <Typography.Text ellipsis={{ tooltip: document.name }}>
                      {document.name}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={styles.meta}>
                      {document.type}
                    </Typography.Text>
                  </Flex>
                </Flex>

                {isSigned ? (
                  <Tag
                    color="success"
                    variant="filled"
                    icon={<CheckOutlined />}
                    style={pill}
                  >
                    {t("loanPage.executed")}
                  </Tag>
                ) : (
                  <Button style={styles.action} onClick={() => onSign?.(document)}>
                    {t("sign.reviewAndSign")}
                  </Button>
                )}
              </Flex>
            </Flex>
          );
        })}

        {/*
          WHERE THIS LEAVES OPA, named — PRODUCT.md's fourth principle and the
          WBS's own note on the story: the documents cannot be changed in
          DocuSign, the signature is the only thing provided there, and the
          date is applied automatically. The panel that used to carry this is
          gone; the sentence is not.
        */}
        <Divider style={styles.rule} />
        <Flex align="center" gap={8} style={styles.handoff}>
          <LockOutlined style={s.handoffIcon} />
          <Typography.Text type="secondary" style={styles.meta}>
            {t("sign.loanExternalNote")}
          </Typography.Text>
        </Flex>
      </Card>
    </Flex>
  );
}

export default SignLoanAgreement;
