// src/features/Payments/ui/ScheduleMix.tsx
//
// THE SCHEDULE AS A SHAPE — twelve instalments split by where they stand.
//
// The page had two ways of reading the same schedule and both were lists: a
// table of rows, and a count in a sentence. Neither answers "how is this loan
// going" without being read line by line. A ring answers it before a word is
// read: mostly teal is a loan that has barely started, mostly green is one
// nearly done, any red at all is a problem — and the legend carries the exact
// counts so nothing is left to the picture alone.
//
// COUNTS, NOT MONEY. The instalments are equal, so the count IS the share, and
// a count needs no currency parsed to be true. It is WBS story 2's own data —
// "if a payment was completed, if a payment is overdue" — drawn rather than
// listed.
//
// `StatusDonut` is the product's own drawing, hand-rolled from an SVG in
// theme colours because antd's Progress cannot draw three arcs and a chart
// library for one ring would be the wrong trade in an antd-only product.
//
// Dumb: a schedule in, a picture out.

import { Card, Flex, Typography, theme } from "antd";
import { StatusDonut, type DonutSegment } from "../../../shared/ui/StatusDonut";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./ScheduleMix.styles";
import type { Installment } from "./types";

export function ScheduleMix({ installments }: { installments: Installment[] }) {
  const t = useT();
  const { token } = theme.useToken();

  const count = (status: Installment["status"]) =>
    installments.filter((row) => row.status === status).length;

  /* Paid, then the problem, then what is still to come — the order a reader
     works through them, and the order of the legend under the ring.
     `colorSuccess` / `colorError` are the same green and red the schedule's
     own status pills take, so the picture and the table agree on colour. */
  const segments: DonutSegment[] = [
    { key: "paid", labelKey: "schedule.paid", value: count("paid"), color: token.colorSuccess },
    { key: "overdue", labelKey: "schedule.overdue", value: count("overdue"), color: token.colorError },
    {
      key: "scheduled",
      labelKey: "schedule.scheduled",
      value: count("scheduled"),
      /* Teal: the brand's own colour for something in hand and not yet done —
         the same ink the product's chrome uses for a current, ordinary state. */
      color: token.colorPrimary,
    },
  ];

  return (
    <Card style={styles.card} styles={{ body: styles.body }}>
      <Typography.Title level={5} style={styles.title}>
        {t("payments.mixTitle")}
      </Typography.Title>
      <Flex align="center" justify="center" style={styles.fill}>
        <StatusDonut segments={segments} centerLabelKey="payments.mixCenter" />
      </Flex>
    </Card>
  );
}

export default ScheduleMix;
