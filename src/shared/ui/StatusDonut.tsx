// src/shared/ui/StatusDonut.tsx
//
// A small multi-segment donut — a picture of a set of counts that sum to a
// whole, e.g. applications split by status. A number says how many are
// approved; the donut says what SHARE of the whole that is, at a glance.
//
// NO CHART LIBRARY. RepaymentRing makes the point for the two-arc case with
// antd's own Progress; this needs three or four arcs, which Progress cannot
// draw, so it is a hand-drawn SVG in the project's own style (colours from
// theme tokens, like every other custom drawing here). A dependency for one
// donut would be the wrong trade — the product is antd-only.
//
// Dumb: labelled, coloured counts in; a picture and its legend out.

import { Flex, Typography, theme } from "antd";
import type { TranslationKey } from "./i18n/dictionary";
import { useT } from "./i18n/useT";
import { getStyles, styles } from "./StatusDonut.styles";

export type DonutSegment = {
  key: string;
  labelKey: TranslationKey;
  value: number;
  /** Resolved from a theme token by the caller — never a raw literal here. */
  color: string;
};

const R = 50;
const C = 2 * Math.PI * R;
/** A sliver of circumference left blank between segments, so the ring reads as
 *  separate arcs rather than one solid band — lighter, more designed. */
const GAP = 9;
const STROKE = 12;

export function StatusDonut({
  segments,
  centerLabelKey,
}: {
  segments: DonutSegment[];
  centerLabelKey: TranslationKey;
}) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  let acc = 0;

  return (
    <Flex vertical gap={24} style={styles.root}>
      <Flex justify="center">
        <div style={styles.ring}>
          <svg viewBox="0 0 120 120" style={styles.svg} role="img" aria-label={t(centerLabelKey)}>
            {/* The trail behind the segments. */}
            <circle cx="60" cy="60" r={R} fill="none" stroke={token.colorFillSecondary} strokeWidth={STROKE} strokeLinecap="round" />
            {total > 0
              ? segments.map((seg) => {
                  if (seg.value <= 0) return null;
                  const len = (seg.value / total) * C;
                  const offset = -(acc / total) * C - GAP / 2;
                  acc += seg.value;
                  // A gap at each end; rounded caps then read as a soft pill.
                  const draw = Math.max(len - GAP, 0.1);
                  return (
                    <circle
                      key={seg.key}
                      cx="60"
                      cy="60"
                      r={R}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={STROKE}
                      strokeLinecap="round"
                      strokeDasharray={`${draw} ${C - draw}`}
                      strokeDashoffset={offset}
                      transform="rotate(-90 60 60)"
                    />
                  );
                })
              : null}
          </svg>
          <div style={styles.center}>
            <Typography.Text style={s.centerLabel}>{t(centerLabelKey)}</Typography.Text>
            <Typography.Text style={s.centerValue}>{total}</Typography.Text>
          </div>
        </div>
      </Flex>

      {/* The legend IS the numbers — the donut is what makes them one fact.
          Full width: the label sits at the left edge, its count at the right. */}
      <Flex vertical gap={12} style={styles.legend}>
        {segments.map((seg) => (
          <Flex key={seg.key} align="center" justify="space-between" gap={12}>
            <Flex align="center" gap={10}>
              <span style={{ ...styles.dot, background: seg.color }} />
              <Typography.Text style={s.legendLabel}>{t(seg.labelKey)}</Typography.Text>
            </Flex>
            <Typography.Text style={s.legendValue}>{seg.value}</Typography.Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default StatusDonut;
