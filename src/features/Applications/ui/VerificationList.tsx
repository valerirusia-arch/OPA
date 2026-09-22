// src/features/Applications/ui/VerificationList.tsx
//
// The automated checks for one applicant. It was one flat list of six rows —
// four pass/fail checks, a credit score sitting large in the middle of them,
// and the eligibility conclusion — and it read as chaos: *"სრული ქაოსი."* The
// three are not the same kind of thing, so they are no longer drawn the same:
//
//   · the PASS/FAIL checks (identity, OFAC, no-lend, income) are a tidy list,
//     each led by a status mark so the column of green ticks scans in one look;
//   · the CREDIT SCORE is a gauge — a judgement, not a pass, so it gets the
//     meter that says where 648 falls (see CreditScoreGauge);
//   · the ELIGIBILITY outcome is the conclusion, set apart as a summary at the
//     foot.
//
// Each check still carries the provider that answered it (Integrations epic)
// and its evidence, because an underwriter deciding on a loan should see what
// the pipeline saw, not just its verdict.
//
// Dumb: it renders results it is given.

import type { ReactNode } from "react";
import { Flex, Typography, theme } from "antd";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  ApiFilled,
} from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { CheckOutcomeTag } from "./CheckTags";
import { CreditScoreGauge } from "./CreditScoreGauge";
import { checkAboutKeys, checkLabelKeys, checkProviderKeys } from "./checks";
import { getStyles, styles } from "./VerificationList.styles";
import type { CheckOutcome, VerificationResult } from "./types";

export type VerificationListProps = {
  results: VerificationResult[];
};

/** The status mark that leads each check row: the colour is the outcome. */
function outcomeMark(outcome: CheckOutcome, color: (o: CheckOutcome) => string): ReactNode {
  const common = { style: { fontSize: 18, color: color(outcome) } };
  switch (outcome) {
    case "passed":
      return <CheckCircleFilled {...common} />;
    case "review":
      return <ExclamationCircleFilled {...common} />;
    case "failed":
      return <CloseCircleFilled {...common} />;
    case "unavailable":
      return <ApiFilled {...common} />;
    default:
      return <ClockCircleFilled {...common} />;
  }
}

export function VerificationList({ results }: VerificationListProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const markColor = (outcome: CheckOutcome) =>
    outcome === "passed"
      ? token.colorSuccess
      : outcome === "failed"
        ? token.colorError
        : outcome === "review" || outcome === "unavailable"
          ? token.colorWarning
          : token.colorTextTertiary;

  const credit = results.find((r) => r.key === "credit");
  const eligibility = results.find((r) => r.key === "rules");
  /* The pass/fail pipeline, in the WBS order it runs in, minus the two that
     are drawn on their own. */
  const checks = results.filter((r) => r.key !== "credit" && r.key !== "rules");

  const creditScore = credit && /^\d+$/.test(credit.detail ?? "")
    ? Number(credit.detail)
    : undefined;

  /*
    WHY THE RULES HAVE NOT RUN, when they have not.

    "Eligibility outcome — Not run yet" under a card of checks, one of which is
    flagged, reads as a gap in the evidence: the underwriter is left to work
    out for themselves whether something is missing or whether this is how it
    is meant to look. It is how it is meant to look. The WBS runs the business
    rules LAST — "Applications may be routed to manual review from any
    automated verification step (Identity Verification, Income Verification,
    Credit Check or Business Rule Evaluation)" — so a check that stopped the
    pipeline stopped the rules with it, and they will run when it is settled.

    Which check is derived from the results rather than taken as a prop: the
    first one, in the WBS's own running order, that did not pass. That is by
    definition where the pipeline halted. *"ამ დროს რა ხდება?"*
  */
  const blockedBy =
    eligibility?.outcome === "pending"
      ? checks.find((result) => result.outcome !== "passed")
      : undefined;

  return (
    <Flex vertical gap={20}>
      {/* THE CREDIT SCORE — a gauge, and the card leads on it: it is the one
          result that takes judgement, so it sits at the top. */}
      {credit && creditScore !== undefined ? (
        <CreditScoreGauge
          score={creditScore}
          provider={t(checkProviderKeys.credit)}
        />
      ) : null}

      {/*
        THE CHECKS — the borrower dashboard's record rows, brought over.

        They were a left column of coloured marks with the name beside each and
        the evidence adrift at the far right: the mark, the label and the result
        sat on three different edges, and the row was one line tall so four of
        them stacked into a dense block — *"ადმინკაზე რომ არის, ესე არ
        მომწონს."*

        The dashboard's "steps so far" list already had the answer and it is
        the SAME KIND OF THING: a finished event, what it was, and a tick. So
        this takes its shape exactly — name and a line of context on the left,
        result and the status mark together on the right, hairline between rows
        and the dashboard's own 16 above and below. *"1 ფოტოდან გადმოიტანე
        სფეისინგი."*

        THE MARK MOVED TO THE RIGHT, next to the evidence it belongs to. A tick
        and the words "Full match" are one statement — the outcome — and they
        were on opposite sides of the row. Together they read as the answer;
        the left column is then free to be the question.
      */}
      <Flex vertical>
        {checks.map((result, index) => {
          const about = checkAboutKeys[result.key];
          return (
            <Flex
              key={result.key}
              align="flex-start"
              justify="space-between"
              gap={24}
              /* `wrap`, and a real basis on `name` below. Without them the row
                 could only shrink: the verdict keeps its width, so at 375px
                 the check's explanation was squeezed into 137px of a 309px
                 card — six short lines against a right half holding two
                 words. The conclusion panel under this list already wraps. */
              wrap
              style={index > 0 ? s.row : styles.rowFirst}
            >
              <Flex vertical gap={2} style={styles.name}>
                <Typography.Text style={styles.nameText}>
                  {t(checkLabelKeys[result.key])}
                </Typography.Text>
                {/* WHAT THE CHECK LOOKED AT. The WBS's own words — see
                    `checkAboutKeys`. Not the provider column that came off
                    these rows: that was a vendor name standing where the
                    result stands, with nothing for the underwriter to do
                    about it. */}
                {about ? (
                  <Typography.Text style={s.about}>{t(about)}</Typography.Text>
                ) : null}
              </Flex>
              {/* The outcome, in one place: what was found, and the mark that
                  says how it went. Pinned to the top of the row so it sits on
                  the check's NAME, not halfway down the sentence under it. */}
              <Flex align="center" gap={12} style={styles.end}>
                {result.detail ? (
                  <Typography.Text style={s.evidence}>{result.detail}</Typography.Text>
                ) : null}
                {outcomeMark(result.outcome, markColor)}
              </Flex>
            </Flex>
          );
        })}
      </Flex>

      {/* THE ELIGIBILITY CONCLUSION — the automated verdict that weighs every
          check and the score together. Set apart in a light panel; the colour
          stays on the outcome tag, so the block itself reads calm.

          The REASON sits under the title as its subtitle, where it reads as the
          explanation of the outcome — it used to float in the middle of the row
          between the title and the tag, disconnected from both. The tag alone
          holds the right. */}
      {eligibility ? (
        <div style={s.conclusion}>
          <Flex align="center" justify="space-between" gap={16} wrap>
            <Flex vertical style={styles.name}>
              <Typography.Text strong>{t(checkLabelKeys.rules)}</Typography.Text>
              <Typography.Text type="secondary" style={styles.detail}>
                {eligibility.detail ??
                  (blockedBy
                    ? t("check.rulesBlocked", {
                        check: t(checkLabelKeys[blockedBy.key]),
                      })
                    : t(checkProviderKeys.rules))}
              </Typography.Text>
            </Flex>
            <CheckOutcomeTag outcome={eligibility.outcome} />
          </Flex>
        </div>
      ) : null}
    </Flex>
  );
}

export default VerificationList;
