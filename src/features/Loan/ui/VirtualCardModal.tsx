// src/features/Loan/ui/VirtualCardModal.tsx
//
// The wireframe's "Your Virtual Card Details", rebuilt to the arrangement the
// designer sent: the CARD as a picture at the top, and everything about it as
// one bordered list underneath — type, cardholder, number, security code,
// expiry. One object, then its record.
//
// WHY THE LIST AND NOT THE CARD CARRIES THE FACTS. Both were tried. Printing
// the number, the holder and the expiry on the face reads well while there
// are three of them and falls apart at five: a security code has no place on
// the front of a card, and a face crowded with labelled values stops being a
// picture of an object. Split, each half does one job — the face says WHICH
// card, the list says WHAT IT SAYS — and the list can hold the two facts that
// are not OPA's to print at all.
//
// THE LIST IS THERE BEFORE THE BUTTON IS PRESSED, with the protected values
// as dots. That is the honest drawing of what this product holds:
//
//   "Card details are NOT stored, processed or transmitted by OPA application
//    and are accessible only via a SECURE EMBEDDED VIEW / directly on USIO and
//    is working as a 'black box' for OPA application."
//
// The type, the holder, the last four and the expiry are OPA's own, so they
// are printed from the first frame. The rest of the number and the security
// code are USIO's, so they are dots until USIO is asked — and the rows do not
// move when the answer arrives, because the dots are set at the same size and
// weight as the digits that replace them.
//
// THE EMBED IS A MOCK AND SAYS SO — the same call Epic 3 settled for Repay's
// card form. "OPA does not own these fields" is not "the prototype must not
// show them": hiding the one moment the borrower came for leaves the designer
// with nothing to judge. Dev REPLACES the revealed values with USIO's real
// embedded view rather than restyling this list.
//
// Dumb: local state for the reveal, a fake delay, and one callback so the
// screen knows the hand-off happened.

import { useState } from "react";
import { Alert, Button, Flex, Modal, Tag, Typography, theme } from "antd";
import { EyeOutlined, LockOutlined } from "@ant-design/icons";
import { CardFace } from "../../../shared/ui/CardFace";
import { Logo } from "../../../shared/ui/Logo";
import { useT } from "../../../shared/ui/i18n/useT";
import { pill } from "../../../shared/ui/tag.styles";
import { getStyles, styles } from "./VirtualCardModal.styles";

export type VirtualCardModalProps = {
  open: boolean;
  /** The network USIO issued it on, where OPA has said which. Absent, the
   *  face prints the issuer line instead. */
  brand?: string;
  last4: string;
  cardholder: string;
  /** MM/YY, as printed on the card. */
  expiry: string;
  used: boolean;
  /**
   * The moment the borrower asks USIO for the card. Dev mounts the real embed
   * here; the values below stand in for it until then.
   */
  onOpenAtIssuer?: () => void;
  onCancel?: () => void;
};

/**
 * What USIO's view would return. Mock, and only ever mock — these are invented
 * digits in a prototype, not a card, and nothing in OPA will ever hold them.
 */
const MOCK_PAN = "4111 2233 4455";
const MOCK_CVV = "318";
/** Long enough to read as a request leaving the building. */
const HANDOFF_MS = 900;

export function VirtualCardModal({
  open,
  brand,
  last4,
  cardholder,
  expiry,
  used,
  onOpenAtIssuer,
  onCancel,
}: VirtualCardModalProps) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  /* Closing the dialog closes the hand-off with it: somebody who opens the
     card again asks USIO again, which is what would actually happen. Done on
     the close itself rather than in an effect watching `open` — an effect
     that sets state is a second render for something the click already knew. */
  const close = () => {
    setLoading(false);
    setRevealed(false);
    onCancel?.();
  };

  const reveal = () => {
    setLoading(true);
    onOpenAtIssuer?.();
    window.setTimeout(() => {
      setLoading(false);
      setRevealed(true);
    }, HANDOFF_MS);
  };

  /**
   * The record of the card, in the order the reference reads it: what it is,
   * whose it is, then the three things printed on it.
   *
   * `secret` marks the two USIO holds — they are dots until the secure view
   * has been asked, and they are the only rows the button changes.
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
      value: revealed ? (
        /* Copyable only once it IS a number — a mask cannot be copied, and
           antd would happily offer the dots. */
        <Typography.Text
          style={{ ...s.rowValue, ...styles.rowValue }}
          copyable={{ text: `${MOCK_PAN} ${last4}`.replace(/\s/g, ""), tooltips: false }}
        >
          {`${MOCK_PAN} ${last4}`}
        </Typography.Text>
      ) : (
        <Typography.Text style={s.rowMasked}>
          {t("loanPage.cardNumberMasked", { last4 })}
        </Typography.Text>
      ),
    },
    {
      key: "cvv",
      label: t("loanPage.cardCvv"),
      value: revealed ? (
        <Typography.Text style={s.rowValue}>{MOCK_CVV}</Typography.Text>
      ) : (
        <Typography.Text style={s.rowMasked}>{t("loanPage.cardCvvMasked")}</Typography.Text>
      ),
    },
    {
      key: "expiry",
      label: t("loanPage.cardExpires"),
      value: <Typography.Text style={s.rowValue}>{expiry}</Typography.Text>,
    },
  ];

  return (
    <Modal
      open={open}
      title={t("loanPage.cardModalTitle")}
      onCancel={close}
      destroyOnHidden
      width={520}
      footer={
        <Flex align="center" justify="flex-end" gap={12}>
          <Tag color={used ? "processing" : undefined} variant="filled" style={pill}>
            {t(used ? "loanPage.cardUsed" : "loanPage.cardUnused")}
          </Tag>
          {revealed ? (
            <Button size="large" onClick={() => setRevealed(false)}>
              {t("loanPage.cardHideDetails")}
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<EyeOutlined />}
              loading={loading}
              onClick={reveal}
            >
              {t("loanPage.cardShowDetails")}
            </Button>
          )}
        </Flex>
      }
    >
      {/* THE CARD, AND NOTHING WRITTEN ON IT. The nameplate face: the mark on
          its white tile at the top, what the card is along the foot with the
          holder under it, and the state where a network mark would sit. Every
          value it used to print is in the list below, so the two halves of
          this dialog never say the same thing twice. */}
      <Flex justify="center" style={styles.face}>
        <div style={styles.faceSize}>
          <CardFace
            nameplate
            brand={brand}
            label={t("loanPage.cardTypeValue")}
            status={{ label: t(used ? "loanPage.cardUsed" : "loanPage.cardUnused") }}
            number={t("payments.cardEnding", { last4 })}
            facts={[{ key: "holder", label: t("loanPage.cardholder"), value: cardholder }]}
          />
        </div>
      </Flex>

      <div style={s.list}>
        {rows.map((row, index) => (
          <Flex
            vertical
            gap={2}
            key={row.key}
            style={index < rows.length - 1 ? s.rowRuled : s.row}
          >
            <Typography.Text style={s.rowLabel}>{row.label}</Typography.Text>
            {row.value}
          </Flex>
        ))}
      </div>

      {/* Said before the button, not after it: what pressing it does. Once it
          has been pressed the warning is the one that matters instead — the
          borrower is looking at a real card number. */}
      {revealed ? (
        <>
          <Alert
            style={styles.note}
            type="warning"
            showIcon
            title={t("loanPage.cardRevealedNote")}
          />
          <Flex align="center" gap={8} style={styles.issuerRow}>
            <LockOutlined style={s.issuerIcon} />
            <Typography.Text type="secondary" style={styles.issuerCaption}>
              {t("loanPage.cardIssuerView")}
            </Typography.Text>
          </Flex>
        </>
      ) : (
        <Typography.Text type="secondary" style={styles.note}>
          {t("loanPage.cardBody")}
        </Typography.Text>
      )}
    </Modal>
  );
}

export default VirtualCardModal;
