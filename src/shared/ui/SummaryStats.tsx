// src/shared/ui/SummaryStats.tsx
//
// A row of summary stat cards — a micro-label over a figure, the product's own
// two type treatments (see figures.styles). Used by the back-office Dashboard
// and the Reporting screen, so the two describe the same numbers the same way.
//
// Dumb: it renders the labelled counts it is handed.

import { Card, Flex, Typography, theme } from "antd";
import type { TranslationKey } from "./i18n/dictionary";
import { useT } from "./i18n/useT";
import { getFigureStyles } from "./figures.styles";
import { styles } from "./SummaryStats.styles";

export type SummaryStat = {
  key: string;
  labelKey: TranslationKey;
  value: number | string;
};

export function SummaryStats({ items }: { items: SummaryStat[] }) {
  const t = useT();
  const { token } = theme.useToken();
  const fig = getFigureStyles(token);

  return (
    <Flex gap={12} wrap style={styles.row}>
      {items.map((stat) => (
        <Card key={stat.key} style={styles.card} styles={{ body: styles.body }}>
          <Flex vertical gap={4}>
            <Typography.Text style={fig.microLabel}>{t(stat.labelKey)}</Typography.Text>
            <Typography.Text style={fig.figure}>{stat.value}</Typography.Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

export default SummaryStats;
