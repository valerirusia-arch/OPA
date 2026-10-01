// src/features/Applications/ui/CreditScoreGauge.tsx
//
// The credit score, as a gauge rather than a number in a row.
//
// The score is the one result on the verification card that is a JUDGEMENT, not
// a pass or a fail — 648 means nothing until you know where it falls. So it is
// drawn as a meter across the FICO range, banded poor / fair / good, with a
// needle at the score: a glance tells the underwriter which way it leans —
// *"სქორისთვის გაუge... ცუდია წითელისკენ, კაია მწვანესკენ, საშუალო
// ყვითელისკენ."* The number takes the band's colour for the same reason.
//
// The score exists nowhere the borrower can reach it (WBS story 3), which is
// why it gets this weight here and nowhere else.
//
// Dumb: it renders a number.

import { Flex, Typography, theme } from "antd";
import { useT } from "../../../shared/ui/i18n/useT";
import {
  BAND_HIGH,
  BAND_LOW,
  SCORE_MAX,
  SCORE_MIN,
  getStyles,
  scorePct,
  styles,
} from "./CreditScoreGauge.styles";

export type CreditScoreGaugeProps = {
  score: number;
  /** The provider line, e.g. "Equifax · score visible only in this portal". */
  provider: string;
};

export function CreditScoreGauge({ score, provider }: CreditScoreGaugeProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  /* Which band the score is in, and the colour that goes with it. */
  const band =
    score < BAND_LOW
      ? { label: t("verify.bandPoor"), color: token.colorError }
      : score < BAND_HIGH
        ? { label: t("verify.bandFair"), color: token.colorWarning }
        : { label: t("verify.bandGood"), color: token.colorSuccess };

  return (
    <div style={s.panel}>
      <Flex align="flex-start" justify="space-between" gap={16} wrap>
        <div>
          <Typography.Text style={{ ...styles.micro, color: token.colorTextTertiary }}>
            {t("verify.creditScore")}
          </Typography.Text>
          <Flex align="baseline" gap={10} style={{ marginTop: 4 }}>
            <Typography.Text style={{ ...styles.score, color: band.color }}>
              {score}
            </Typography.Text>
            <Typography.Text style={{ ...styles.band, color: band.color }}>
              {band.label}
            </Typography.Text>
          </Flex>
        </div>
        <Typography.Text style={s.provider}>{provider}</Typography.Text>
      </Flex>

      {/* The banded track, notched at the score by a bracketed gap. */}
      <div style={s.track}>
        <div style={{ ...s.markerWrap, left: `${scorePct(score)}%` }}>
          {/* A CALIPER on the score: a mark above and below point in at the
              exact spot, and between them a white line runs through the band
              with the band's own zone colour inside it — *"შუაში თეთრი ხაზი და
              მაგის შიგნით ყვითელი ზოლი."* The caliper and the inner stripe wear
              the zone colour (red / amber / green, set inline); the line is the
              solid surface, so it reads clean over any zone. Centred on the band,
              overhanging a little above and below. */}
          <svg width={20} height={28} viewBox="0 0 20 28" fill="none" aria-hidden="true">
            <path d="M5 0 H15 L10 7 Z" fill={band.color} />
            <path d="M5 28 H15 L10 21 Z" fill={band.color} />
            <rect x="7" y="8" width="6" height="12" rx="3" fill={token.colorBgContainer} />
            <rect x="9" y="8" width="2" height="12" rx="1" fill={band.color} />
          </svg>
        </div>
      </div>
      <Flex justify="space-between" style={{ marginTop: 6 }}>
        <Typography.Text style={{ ...styles.ends, ...s.endsQuiet }}>
          {SCORE_MIN}
        </Typography.Text>
        <Typography.Text style={{ ...styles.ends, ...s.endsQuiet }}>
          {SCORE_MAX}
        </Typography.Text>
      </Flex>
    </div>
  );
}

export default CreditScoreGauge;
