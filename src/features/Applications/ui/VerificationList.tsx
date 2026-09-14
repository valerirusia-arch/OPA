// src/features/Applications/ui/VerificationList.tsx
//
// The automated checks for one applicant, in the order the WBS runs them, with
// the evidence each came back with.
//
// WBS, "View application details": an internal user must be able to see
// "verification results", and the note adds "Supporting evidence is available
// within the application". So each row carries the provider's own answer — a
// score, a match, a reason — not just a pass mark. An underwriter deciding on
// somebody's loan should not have to take the pipeline's word for it.
//
// Three things per row, as the wireframe lays them out: the check, WHO
// answered it underneath (the provider, from the Integrations epic), and the
// outcome on the right with the evidence beside it. The score sits large next
// to its tag because it is the one figure on this card anybody reads twice.
//
// The order is a requirement rather than a layout choice: identity runs before
// credit "to minimize external credit bureau costs", so reading the list top
// to bottom is reading the process in the order it happened.
//
// Dumb: it renders results it is given.

import { Divider, Flex, Grid, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { CheckOutcomeTag } from "./CheckTags";
import { checkLabelKeys, checkProviderKeys } from "./checks";
import { getStyles, styles } from "./VerificationList.styles";
import type { VerificationResult } from "./types";

export type VerificationListProps = {
  results: VerificationResult[];
};

export function VerificationList({ results }: VerificationListProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  // On a phone the check name and a full sentence of evidence cannot share one
  // line without one of them breaking mid-word; below `sm` (576px) the row
  // stacks — name over evidence, each on its own full-width line.
  const screens = Grid.useBreakpoint();
  const stack = screens.sm === false;

  return (
    <Flex vertical>
      {results.map((result, index) => (
        <Flex vertical key={result.key}>
          {index > 0 ? <Divider style={styles.rule} /> : null}
          <Flex
            vertical={stack}
            align={stack ? "flex-start" : "flex-start"}
            justify="space-between"
            gap={stack ? 8 : 16}
            style={styles.row}
          >
            <Flex vertical style={styles.name}>
              <Typography.Text>{t(checkLabelKeys[result.key])}</Typography.Text>
              <Typography.Text type="secondary" style={styles.detail}>
                {t(checkProviderKeys[result.key])}
              </Typography.Text>
            </Flex>

            <Flex
              align="center"
              gap={12}
              style={stack ? styles.resultStacked : styles.result}
            >
              {/* The evidence, in the provider's own words. A bare score gets
                  the figure treatment; a sentence stays a sentence. */}
              {result.detail ? (
                <Typography.Text
                  style={
                    /^\d+$/.test(result.detail)
                      ? s.score
                      : stack
                        ? styles.evidenceStacked
                        : styles.evidence
                  }
                >
                  {result.detail}
                </Typography.Text>
              ) : null}
              <CheckOutcomeTag outcome={result.outcome} />
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}

export default VerificationList;
