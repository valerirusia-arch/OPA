// src/features/Loan/ui/VirtualCardModal.tsx
//
// The wireframe's "Your Virtual Card Details": a picture of the card, and one
// button — and now the button does the thing it names.
//
// WHAT OPA KNOWS, AND WHAT IT DOES NOT. The name on the card, the expiry and
// the last four digits are the borrower's own details and the token USIO
// handed back, so OPA draws those itself. The PAN and the CVV are not OPA's:
//
//   "Card details are NOT stored, processed or transmitted by OPA application
//    and are accessible only via a SECURE EMBEDDED VIEW / directly on USIO and
//    is working as a 'black box' for OPA application."
//
// A secure embedded view is what the WBS asks for, so that is what this
// dialog does: pressing the button loads USIO's view INSIDE the dialog, and
// everything inside that frame belongs to USIO.
//
// THE FRAME IS A MOCK AND SAYS SO — the same call Epic 3 settled for Repay's
// card form. "OPA does not own these fields" is not "the prototype must not
// show them": hiding the one moment the borrower came for leaves the designer
// with nothing to judge. Dev REPLACES the panel with USIO's real embed rather
// than restyling it, and its internals — field order, masking behaviour, the
// copy button — will be USIO's.
//
// Dumb: local state for the reveal, a fake delay, and one callback so the
// screen knows the hand-off happened.

import { useState } from "react";
import { Alert, Button, Descriptions, Flex, Modal, Tag, Typography, theme } from "antd";
import { EyeOutlined, LockOutlined } from "@ant-design/icons";
import { CardFace } from "../../../shared/ui/CardFace";
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
   * here; the panel below stands in for it until then.
   */
  onOpenAtIssuer?: () => void;
  onCancel?: () => void;
};

/**
 * What USIO's view would show. Mock, and only ever mock — these are invented
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
      {revealed ? (
        /*
          THE CARD, SHOWING ITSELF.

          The first version of this was a form: a grey header bar, a label,
          the number as a heading, then three more labelled fields under it —
          a panel about a card rather than the card. The designer's word for
          it was "საშინელი". What USIO returns IS the front of the card, so
          that is what is drawn: the same object as the masked one behind the
          dialog, with the number unmasked and the security code in the foot.
          The hand-off is still named, under it, where a caption belongs.
        */
        <Flex vertical gap={12} style={styles.face}>
          <CardFace
            tone="opa"
            brand={brand}
            label={t("loanPage.cardIssuer")}
            status={{ label: t("loanPage.cardMock") }}
            number={`${MOCK_PAN} ${last4}`}
            copyable
            facts={[
              { key: "holder", label: t("loanPage.cardholder"), value: cardholder },
              { key: "expires", label: t("loanPage.cardExpires"), value: expiry },
              { key: "cvv", label: t("loanPage.cardCvv"), value: MOCK_CVV },
            ]}
          />

          <Flex align="center" gap={8}>
            <LockOutlined style={s.issuerIcon} />
            <Typography.Text type="secondary" style={styles.issuerCaption}>
              {t("loanPage.cardIssuerView")}
            </Typography.Text>
          </Flex>
        </Flex>
      ) : (
        /* THE SAME CARD THE PAGE BEHIND IT SHOWS. It used to draw its own
           face — its own fill, its own type, its own arrangement — so opening
           the dialog swapped one card for a different-looking one. One
           component, one material, one object. */
        <Flex vertical gap={16} style={styles.face}>
          <CardFace
            tone="opa"
            front
            brand={brand}
            label={t("loanPage.cardIssuer")}
            status={{
              label: t(used ? "loanPage.cardUsed" : "loanPage.cardUnused"),
            }}
            number={t("payments.cardEnding", { last4 })}
            facts={[
              { key: "holder", label: t("loanPage.cardholder"), value: cardholder },
              { key: "expires", label: t("loanPage.cardExpires"), value: expiry },
            ]}
          />

          {/* WHAT OPA ACTUALLY HOLDS — the token's four digits, the expiry and
              the name on the card. Beside the blank front rather than printed
              on it, because these are OPA's records of the card, not what the
              card has written on its face. *"ვიუს როცა დავაწვები, მანდ
              შემეძლო ინფორმაციის ნახვა."* */}
          <Descriptions
            column={1}
            size="small"
            colon={false}
            items={[
              { key: "holder", label: t("loanPage.cardholder"), children: cardholder },
              /* Not the number: the face above prints it now. This list is
                 what the front does not carry. */
              { key: "expires", label: t("loanPage.cardExpires"), children: expiry },
            ]}
          />
        </Flex>
      )}

      {/* Said before the button, not after it: what pressing it does. Once it
          has been pressed the warning is the one that matters instead — the
          borrower is looking at a real card number. */}
      {revealed ? (
        <Alert
          style={styles.note}
          type="warning"
          showIcon
          title={t("loanPage.cardRevealedNote")}
        />
      ) : (
        <Typography.Text type="secondary" style={styles.note}>
          {t("loanPage.cardBody")}
        </Typography.Text>
      )}
    </Modal>
  );
}

export default VirtualCardModal;
