// src/flows/_devbar/CardStatusDock.tsx
//
// A floating preview switch for the CARD'S status — a sibling to StageDock.
//
// The virtual card has two WBS states: "Not used" before it is spent and
// "In use" after ("...before the Virtual Payment Card has been used"). The
// designer's exported card (the sleeve finish) bakes one word into the file,
// so this walks the two on the live overlay: *"ყველა სტატუს იჩანდეს
// გადამრთველით ფლოატედ ღილაკის მეშვეობით."*
//
// Dev-only and tree-shaken in production with the rest of _devbar. It shows
// only where the sleeve card is on screen — the loan page, with a sleeve
// skin — see DevBar.

import { Button, Flex, Tag, Tooltip, Typography, theme } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  CARD_STATUSES,
  CARD_STATUS_LABEL_KEYS,
  setCardStatus,
  useCardStatus,
} from "../../shared/ui/cardStatus";
import { useT } from "../../shared/ui/i18n/useT";
import { getStyles, styles } from "./CardStatusDock.styles";

export function CardStatusDock() {
  const { token } = theme.useToken();
  const s = getStyles(token);
  const t = useT();
  const status = useCardStatus();

  const index = CARD_STATUSES.indexOf(status);
  const step = (delta: number) => {
    const next = CARD_STATUSES[index + delta];
    if (next) setCardStatus(next);
  };

  return (
    <div style={s.dock}>
      <Flex align="center" gap={12}>
        <Tag color="processing" style={styles.tag}>
          DEMO
        </Tag>

        <Tooltip title="Previous status">
          <Button
            size="small"
            type="text"
            icon={<LeftOutlined />}
            style={s.arrow}
            disabled={index <= 0}
            onClick={() => step(-1)}
          />
        </Tooltip>

        <Flex vertical style={styles.readout}>
          <Typography.Text style={s.counter}>Card status</Typography.Text>
          <Typography.Text style={s.label}>
            {t(CARD_STATUS_LABEL_KEYS[status])}
          </Typography.Text>
        </Flex>

        <Tooltip title="Next status">
          <Button
            size="small"
            type="text"
            icon={<RightOutlined />}
            style={s.arrow}
            disabled={index >= CARD_STATUSES.length - 1}
            onClick={() => step(1)}
          />
        </Tooltip>
      </Flex>
    </div>
  );
}

export default CardStatusDock;
