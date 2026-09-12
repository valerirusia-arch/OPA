// src/features/LoanApplication/ui/CardOnFile.tsx
//
// The debit card OPA has on file, as the borrower would recognise it.
//
// Everything here comes from the token Repay hands back — brand, last four,
// expiry. The number, the CVV and the cardholder name are absent because they
// never reach OPA at all, which is the WBS's whole point about story 6.
//
// The pay dialog shows it too, under "Paying with". The payments page does
// NOT: a card on a page about that card is drawn as a card (SavedCardFace),
// because an icon plus two lines of text and a button gave that block three
// different left edges. `active` stays a prop because the dialog can be
// charging a card that is not the default.
//
// Dumb: it renders a token and reports a click.

import { Button, Flex, Tag, Typography, theme } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { pill } from "../../../shared/ui/tag.styles";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./CardOnFile.styles";
import type { CardToken } from "./types";

export type CardOnFileProps = {
  card: CardToken;
  /**
   * WBS Epic 6 story 7: "whether the card is currently used as the ACTIVE
   * repayment method". On the application step there is only ever one card and
   * it is the one being used, hence the default.
   */
  active?: boolean;
  /** Omit where the card is shown but not changeable. */
  onReplace?: () => void;
};

export function CardOnFile({ card, active = true, onReplace }: CardOnFileProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  return (
    /* Wraps: the button and a 19-character masked number cannot share a narrow
       line, and the button dropping below is better than the number breaking. */
    <Flex wrap align="center" gap={14} style={s.row}>
      <Flex align="center" justify="center" style={s.badge}>
        <CreditCardOutlined />
      </Flex>

      <Flex vertical style={styles.text}>
        <Flex align="center" gap={8}>
          <Typography.Text style={styles.number}>
            {`•••• •••• •••• ${card.last4}`}
          </Typography.Text>
          <Tag color={active ? "success" : undefined} style={pill}>
            {t(active ? "card.active" : "card.inactive")}
          </Tag>
        </Flex>
        <Typography.Text type="secondary" style={styles.meta}>
          {t("card.debitLine", { brand: card.brand, exp: card.expiry })}
        </Typography.Text>
      </Flex>

      {onReplace ? (
        <Button style={styles.action} onClick={onReplace}>
          {t("card.replace")}
        </Button>
      ) : null}
    </Flex>
  );
}

export default CardOnFile;
