// src/features/Loan/ui/VirtualCardModal.tsx
//
// The wireframe's "Your Virtual Card Details", in the arrangement the designer
// sent: a small picture of the card, its name centred under it, and one
// bordered list holding everything the card says — type, cardholder, number,
// security code, expiry.
//
// ONE VIEW, NO SECOND PRESS. There was a "Show card details" button and the
// protected values sat as dots until it was pressed. *"შოვ ქარდ დეთაილს არ
// გვინდა, ეგრევე ვანახოთ დეტალები, როგორც კი გავხსნით."* The request the WBS
// cares about is still made — it is the View on the loan page that makes it.
// This dialog IS the secure view, so it opens showing what the secure view
// returned rather than making the borrower ask twice for the thing they
// already asked for. What Dev changes at integration is where the values come
// from, not how many presses it takes to see them:
//
//   "Card details are NOT stored, processed or transmitted by OPA application
//    and are accessible only via a SECURE EMBEDDED VIEW / directly on USIO and
//    is working as a 'black box' for OPA application."
//
// So the PAN and the security code below are a mock and say so in the code:
// invented digits in a prototype, never a card, and nothing in OPA will ever
// hold them. Dev replaces those two values with USIO's embedded view; the
// type, the cardholder and the expiry are OPA's own and stay.
//
// WHY THE LIST AND NOT THE CARD CARRIES THE FACTS. Both were tried. Printing
// the number, the holder and the expiry on the face reads well while there
// are three of them and falls apart at five: a security code has no place on
// the front of a card, and a face crowded with labelled values stops being a
// picture of an object. Split, each half does one job — the thumbnail says
// WHICH card, the list says what it says.
//
// Dumb: it renders what it is handed and reports that it was opened.

import { Flex, Modal, Typography, theme } from "antd";
import { BlockOutlined, CheckOutlined, LockOutlined } from "@ant-design/icons";
import { CardFace } from "../../../shared/ui/CardFace";
import { Logo } from "../../../shared/ui/Logo";
import { useT } from "../../../shared/ui/i18n/useT";
import { getStyles, styles } from "./VirtualCardModal.styles";

export type VirtualCardModalProps = {
  open: boolean;
  /** The network USIO issued it on, where OPA has said which. */
  brand?: string;
  last4: string;
  cardholder: string;
  /** MM/YY, as printed on the card. */
  expiry: string;
  used: boolean;
  onCancel?: () => void;
};

/**
 * What USIO's view returns. Mock, and only ever mock — these are invented
 * digits in a prototype, not a card, and nothing in OPA will ever hold them.
 */
const MOCK_PAN = "4111 2233 4455";
const MOCK_CVV = "318";

export function VirtualCardModal({
  open,
  last4,
  cardholder,
  expiry,
  used,
  onCancel,
}: VirtualCardModalProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const pan = `${MOCK_PAN} ${last4}`;

  /**
   * The record of the card, in the order the reference reads it: what it is,
   * whose it is, then the three things printed on it.
   */
  const rows = [
    {
      key: "type",
      label: t("loanPage.cardType"),
      /* THE MARK BESIDE THE NAME. The reference's first row is the network's
         badge; OPA's card is not on a public network the borrower would
         recognise, so it carries OPA's own. */
      value: (
        <Flex align="center" gap={10}>
          <div style={s.typeMark}>
            <Logo height={18} />
          </div>
          <Typography.Text style={s.rowValue}>{t("loanPage.cardTypeValue")}</Typography.Text>
        </Flex>
      ),
    },
    {
      key: "holder",
      label: t("loanPage.cardholder"),
      value: <Typography.Text style={s.rowValue}>{cardholder}</Typography.Text>,
    },
    {
      key: "number",
      label: t("loanPage.cardNumber"),
      value: <Typography.Text style={s.rowValue}>{pan}</Typography.Text>,
      /* THE ONE ROW WORTH COPYING — a card number is read off a screen and
         typed into a form, and this is the form's way of not being retyped.
         It is the row's action, so it hangs on the row's right edge and is
         centred against the WHOLE row rather than against the digits: inside
         the value it sat on the number's own line, level with nothing, a
         third of the way down a 64px row. *"ეს აიქონი გაასაშუალოე და შუაში
         აწიე."*

         A `Typography.Text` with no children renders antd's copy button and
         nothing else — the clipboard, the copied state and the accessible
         label all stay antd's, and only the placement is ours. */
      action: (
        <Typography.Text
          copyable={{
            text: pan.replace(/\s/g, ""),
            tooltips: false,
            icon: [
              <span key="copy" style={s.copyChip}>
                <BlockOutlined />
              </span>,
              <span key="copied" style={s.copiedChip}>
                <CheckOutlined />
              </span>,
            ],
          }}
        />
      ),
    },
    {
      key: "cvv",
      label: t("loanPage.cardCvv"),
      value: <Typography.Text style={s.rowValue}>{MOCK_CVV}</Typography.Text>,
    },
    {
      key: "expiry",
      label: t("loanPage.cardExpires"),
      value: <Typography.Text style={s.rowValue}>{expiry}</Typography.Text>,
    },
  ];

  return (
    /* NO TITLE BAR AND NO FOOTER — the close is the only chrome, the way the
       reference draws it. The dialog's heading is the card's own name, centred
       under its picture, because that is what a reader is here to confirm; a
       bar across the top saying "Your OPA card" over a card said it first and
       said it smaller. */
    <Modal
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      /* CENTRED, not hung from antd's default 100px top. This dialog is tall
         enough that the default left more air above it than below and it read
         as having slipped down the page — *"გაასაშუალე კონტენერი, ეხლა ცოტა
         დაბლაა თითქოს."* */
      centered
      width={620}
      footer={null}
      styles={{ body: styles.body }}
    >
      <Flex vertical align="center" style={styles.head}>
        {/* The thumbnail: the mark on its tile top left, the state where a
            network mark would sit — *"მარჯვნივ ეწერება ინ იუს, დაბლა,
            მასტერქარდის მაგივრად."* Nothing else; see CardFace's nameplate. */}
        <div style={styles.face}>
          <CardFace
            variant="thumb"
            label={t("loanPage.cardTypeValue")}
            status={{ label: t(used ? "loanPage.cardUsed" : "loanPage.cardUnused") }}
            number={t("payments.cardEnding", { last4 })}
          />
        </div>

        <Typography.Text style={{ ...s.cardName, ...styles.title }}>
          {t("loanPage.cardTypeValue")}
        </Typography.Text>
      </Flex>

      <div style={s.list}>
        {rows.map((row, index) => (
          <Flex
            align="center"
            justify="space-between"
            gap={16}
            key={row.key}
            style={index < rows.length - 1 ? s.rowRuled : s.row}
          >
            <Flex vertical gap={2}>
              <Typography.Text style={s.rowLabel}>{row.label}</Typography.Text>
              {row.value}
            </Flex>
            {"action" in row ? row.action : null}
          </Flex>
        ))}
      </div>

      {/* One line, not a yellow slab: whose details these are, and the reason
          to close the window. The warning Alert that used to live here was
          three lines of ink under a list that is itself the sensitive thing —
          it made the dialog look like an error. */}
      <Flex align="flex-start" gap={8} style={styles.issuer}>
        <LockOutlined style={{ ...s.issuerIcon, ...styles.issuerIconBox }} />
        <Typography.Text type="secondary" style={styles.issuerText}>
          {t("loanPage.cardIssuerNote")}
        </Typography.Text>
      </Flex>
    </Modal>
  );
}

export default VirtualCardModal;
