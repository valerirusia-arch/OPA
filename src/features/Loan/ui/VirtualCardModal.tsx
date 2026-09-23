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

import { useState } from "react";
import { Button, Flex, Modal, Typography, theme } from "antd";
import {
  BlockOutlined,
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";
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

  /*
    THE NUMBER AND THE CVV ARE COVERED UNTIL ASKED FOR, and separately.

    This dialog is opened in the places a card gets used — a desk, a phone on a
    table — and its own footer already says so: anyone looking at the screen can
    read them. Two secrets, two switches: *"ეს ორი უნდა იყოს დაფარული, ორივეგან
    უნდა იყოს თვალის აიქონი, ანუ ცალ-ცალკე უნდა შემეძლოს ინფოს ნახვა."*

    Revealing one does not reveal the other, so the CVV — the part that turns a
    number somebody glimpsed into a usable card — can stay hidden while the
    number is read out.
  */
  const [showPan, setShowPan] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const pan = `${MOCK_PAN} ${last4}`;
  /* Masked in the card's own grouping, so the covered value occupies the line
     the real one will — the row does not jump when the eye is pressed. */
  const panMasked = "•••• •••• •••• " + last4;
  const cvvMasked = "•••";

  /** The eye, in the row's action slot beside the copy control. */
  const reveal = (shown: boolean, onToggle: () => void, label: string) => (
    <Button
      type="text"
      size="small"
      aria-label={label}
      style={s.revealButton}
      icon={shown ? <EyeOutlined style={s.copyIcon} /> : <EyeInvisibleOutlined style={s.copyIcon} />}
      onClick={onToggle}
    />
  );

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
      value: (
        <Typography.Text style={s.rowValue}>{showPan ? pan : panMasked}</Typography.Text>
      ),
      /* THE ONE ROW WORTH COPYING — a card number is read off a screen and
         typed into a form, and this is the form's way of not being retyped.
         It is the ROW's action, so it is centred against the whole row rather
         than against the digits: inside the value it sat on the number's own
         line, a third of the way down a 64px row, level with nothing.
         *"ეს აიქონი შუაში აწიე."*

         A `Typography.Text` with no children renders antd's copy button and
         nothing else, so the clipboard, the copied state and the accessible
         label all stay antd's and only the placement is ours. The glyph is
         `BlockOutlined` — two clean overlapping squares, which is the copy
         glyph people actually recognise. antd's own `CopyOutlined` is a sheet
         with a folded corner behind another and at 18px it reads as a
         document, not as an action. *"აქ უკეთესი დაკოპირების აიქონი ჩასვი."* */
      action: (
        <Flex align="center" gap={4}>
          {reveal(showPan, () => setShowPan((v) => !v), t("loanPage.cardNumber"))}
          {/* Copy stays available while the number is covered: copying does not
              put it on the screen, which is the thing being guarded. */}
          <Typography.Text
            copyable={{
              text: pan.replace(/\s/g, ""),
              tooltips: false,
              icon: [
                <BlockOutlined key="copy" style={s.copyIcon} />,
                <CheckOutlined key="copied" style={s.copiedIcon} />,
              ],
            }}
          />
        </Flex>
      ),
    },
    {
      key: "cvv",
      label: t("loanPage.cardCvv"),
      value: (
        <Typography.Text style={s.rowValue}>{showCvv ? MOCK_CVV : cvvMasked}</Typography.Text>
      ),
      action: reveal(showCvv, () => setShowCvv((v) => !v), t("loanPage.cardCvv")),
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
        {/* THE SAME CARD AS /loan, AT A QUARTER OF THE WIDTH. It was the mark
            and the state alone, on the argument that nothing else survives at
            160px; every measurement on the face is a fraction of the face
            now, so the name and the holder come down with it — *"აქ
            ტექსტებიც უნდა გამოჩნდეს, ოპას ვირტუალ ქარდი და ლევი აკერმანი,
            დასქეილებული, ძაან პატარა ზომის."* One drawing at two sizes
            rather than two drawings. */}
        <div style={styles.face}>
          <CardFace
            front
            label={t("loanPage.cardTypeValue")}
            status={{ label: t(used ? "loanPage.cardUsed" : "loanPage.cardUnused") }}
            facts={[{ key: "holder", label: t("loanPage.cardholder"), value: cardholder }]}
          />
        </div>

        {/* NO NAME UNDER THE THUMBNAIL. It read "OPA Virtual Card" directly
            above a "Card type" row saying the same words, with the card itself
            printing them a third time: *"ეს თაითლი ამოვიღოთ, ქვემოთ ისედაც
            გვიწერია და განმეორებადი ინფოა."* */}
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
