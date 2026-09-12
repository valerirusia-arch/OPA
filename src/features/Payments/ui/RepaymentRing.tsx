// src/features/Payments/ui/RepaymentRing.tsx
//
// The schedule as one shape.
//
// WHY A RING AND NOT A SECOND "3 of 12". The Payments tile already states the
// count, and a picture that says only what a number two bands up already said
// is decoration. This one says something the count cannot: the SHAPE of the
// twelve. Green for what is behind, red for what is late, the rail for what
// is still to come — so a borrower three instalments in with one of them
// overdue sees the problem in the ring before they read a word, and a
// borrower who is simply on schedule sees an unbroken arc.
//
// That is also why the arcs are in this order rather than largest-first: they
// are a TIMELINE bent into a circle. Paid comes first because it happened
// first.
//
// antd's own `Progress`, not a chart library. Its circle takes exactly two
// arcs — `percent` and `success.percent` — which is exactly the two this
// needs, and it brings the rail, the rounding and the sizing with it. A
// second dependency for one donut would be the wrong trade twice over: the
// product is antd-only, and nothing here needs a chart engine.
//
// Dumb: three numbers in, a picture out.

import { Flex, Progress, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./RepaymentRing.styles";

export type RepaymentRingProps = {
  /** Instalments settled. */
  paid: number;
  /** Instalments past their due date and still unpaid. */
  overdue: number;
  /** The whole schedule. */
  total: number;
};

export function RepaymentRing({ paid, overdue, total }: RepaymentRingProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /* A schedule of nothing is not a ring at 0% — it is a ring that has no
     meaning yet, and the screen draws its own empty state instead. */
  if (total <= 0) return null;

  const share = (count: number) => Math.round((count / total) * 100);
  const left = Math.max(total - paid - overdue, 0);

  return (
    <Flex vertical align="center" gap={20}>
      <Progress
        type="circle"
        size={168}
        /* TWO ARCS, DRAWN AS ONE. antd lays `success` over the start of
           `percent`, so the outer value has to be everything that is not
           still ahead — paid AND overdue — and the success arc then covers
           the paid part of it. What is left uncovered is the red. */
        percent={share(paid + overdue)}
        strokeColor={token.colorError}
        success={{ percent: share(paid), strokeColor: token.colorSuccess }}
        strokeWidth={9}
        trailColor={token.colorFillSecondary}
        format={() => (
          <Flex vertical align="center" gap={2}>
            <Typography.Text style={s.centre}>{share(paid)}%</Typography.Text>
            <Typography.Text style={s.centreLabel}>
              {t("dashboard.ringCentre")}
            </Typography.Text>
          </Flex>
        )}
      />

      {/*
        THE LEGEND IS THE NUMBERS, not a key to the colours.

        A ring with a colour key beside it makes the reader do a lookup before
        they learn anything. These three lines are readable on their own — the
        ring is what makes them one fact instead of three — and the overdue
        line is simply absent when nothing is overdue, because a row reading
        "Overdue 0" is the product raising a subject nobody asked about.
      */}
      <Flex vertical gap={10} style={styles.legend}>
        <Flex align="center" justify="space-between" gap={16}>
          <Flex align="center" gap={9}>
            <span style={s.dotPaid} />
            <Typography.Text style={styles.legendLabel}>
              {t("dashboard.ringPaid")}
            </Typography.Text>
          </Flex>
          <Typography.Text style={s.legendValue}>
            {t("dashboard.ringCount", { count: String(paid), total: String(total) })}
          </Typography.Text>
        </Flex>

        {overdue > 0 ? (
          <Flex align="center" justify="space-between" gap={16}>
            <Flex align="center" gap={9}>
              <span style={s.dotOverdue} />
              <Typography.Text style={styles.legendLabel}>
                {t("dashboard.ringOverdue")}
              </Typography.Text>
            </Flex>
            <Typography.Text style={s.legendValueAlarm}>{overdue}</Typography.Text>
          </Flex>
        ) : null}

        <Flex align="center" justify="space-between" gap={16}>
          <Flex align="center" gap={9}>
            <span style={s.dotLeft} />
            <Typography.Text style={styles.legendLabel}>
              {t("dashboard.ringLeft")}
            </Typography.Text>
          </Flex>
          <Typography.Text style={s.legendValue}>{left}</Typography.Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default RepaymentRing;
