// src/features/Applications/ui/ChangeHistory.tsx
//
// Every change to the requested loan amount, and who made it.
//
// The wireframe reserves the space — "here will be maybe small table (change
// history)" — and the WBS decides what goes in it: "All changes shall be logged
// with the PREVIOUS VALUE, UPDATED VALUE, USER, DATE, and REASON."
//
// NOT A TABLE, though. Four columns for a handful of entries put the amounts,
// the name and the reason on their own narrow tracks and scrolled the last one
// out of sight — *"ძალიან უცნაურია ეს თებლი, აქ თებლს არ ვიზამდი."* A change
// is one sentence: an amount became another amount, on a date, by someone, for
// a reason. So each entry is read as that — the change as the headline, the
// when / who / why on one quiet line under it — a log, not a grid.
//
// It reads the same audit entries the full trail below the page does, narrowed
// to the ones that moved a figure, so the two never disagree.
//
// Dumb: it renders entries it is given.

import { Divider, Flex, Typography, theme } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./ChangeHistory.styles";
import type { AuditEntry } from "./types";

export type ChangeHistoryProps = {
  /** The whole trail. Only the amount changes in it are shown. */
  entries: AuditEntry[];
};

export function ChangeHistory({ entries }: ChangeHistoryProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /**
   * Amount changes only, matched on the action rather than on "has a from and
   * a to" — an overridden decision also records a previous and a new value, and
   * belongs in the full trail, not under a heading about the amount.
   */
  const changes = entries.filter((entry) => entry.action === "audit.amountChanged");

  if (changes.length === 0) {
    return (
      <Typography.Text type="secondary" style={styles.empty}>
        {t("amountPanel.noChanges")}
      </Typography.Text>
    );
  }

  return (
    <Flex vertical>
      {changes.map((entry, index) => (
        <div key={entry.id}>
          {index > 0 ? <Divider style={styles.rule} /> : null}
          <Flex vertical gap={4}>
            {/* The change itself, the headline of the entry. */}
            <Flex align="center" gap={10} wrap>
              <Typography.Text delete style={s.from}>
                {entry.from}
              </Typography.Text>
              <ArrowRightOutlined style={s.arrow} />
              <Typography.Text style={s.to}>{entry.to}</Typography.Text>
            </Flex>
            {/* When, who, and — where there is one — why, as one quiet line. */}
            <Typography.Text type="secondary" style={styles.meta}>
              {entry.on}
              {` · ${entry.by}`}
              {entry.reason ? ` · ${entry.reason}` : ""}
            </Typography.Text>
          </Flex>
        </div>
      ))}
    </Flex>
  );
}

export default ChangeHistory;
