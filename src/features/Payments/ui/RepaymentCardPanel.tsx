// src/features/Payments/ui/RepaymentCardPanel.tsx
//
// The card the borrower repays with. WBS stories 7 and 8.
//
// Story 7 is mostly a list of things this must NOT do: "Full card details are
// not stored or displayed in the OPA application. Only masked card information
// and the payment token/reference received from Repay are stored and shown."
// So the card is a brand, four digits and an expiry, and there is nothing to
// click that would reveal more, because there is no more.
//
// "THEY CANNOT SEE EACH OTHERS CARD INFORMATION. Borrower/Co-borrower should
// see only the cards that the current user added." That is not a display rule
// this component can enforce on its own — the screen hands it the reader's own
// cards and nothing else. What it does own is saying so, once, so that a
// co-borrower looking at an empty panel understands they are not looking at a
// broken page.
//
// Story 8: "old card should be removed and the new should pass the same flow
// as when adding a card for the first time... Should work in REPLACE MODE:
// old card is deleted and the new is saved." Hence one warning before the
// form, and the same Repay form the application step uses — not a copy of it.
//
// THE FORM IS A DIALOG, NOT A PANEL THAT DROPS OPEN. It used to replace the
// card's body in place: pressing Update made the card you were looking at
// disappear and pushed everything under it down the page. Entering card
// details is a task with a beginning and an end, and it is short — which is
// what a modal is for. The panel stays exactly as it was behind it.
//
// AND SAVING ASKS FIRST. WBS story 8 is replace mode — "old card should be
// removed and the new should pass the same flow as when adding a card for the
// first time" — so pressing Save in Repay's form deletes the card every
// payment is taken from. That is worth one question.
//
// IT OWNS ITS CARD, unlike the other blocks on the payments page, which are
// wrapped in a `<Card title=…>` by the screen. The reason is the head's
// right-hand slot: "Update" belongs beside the title rather than as a
// full-width button under the card face, and whether that action should be
// there at all depends on this component's own state — it is hidden while the
// Repay form is open and while there is no card to update. A parent cannot
// answer that without being handed the state, so the head comes here with the
// body it belongs to.
//
// Dumb: local state for which panel is showing; the token goes out by callback.

import { useState } from "react";
import { Alert, Button, Card, Divider, Flex, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";
import { EmptyState } from "../../../shared/ui/EmptyState";
import { SavedCardFace } from "./SavedCardFace";
import { ExternalPanel } from "../../LoanApplication/ui/ExternalPanel";
import { RepayCardForm } from "../../LoanApplication/ui/RepayCardForm";
import type { CardToken } from "../../LoanApplication/ui/types";
import { styles } from "./RepaymentCardPanel.styles";
import type { RepaymentCard } from "./types";

export type RepaymentCardPanelProps = {
  /** The card's heading. The screen supplies it; the head lives here. */
  title: string;
  /** Already narrowed to the reader's own cards. WBS story 7. */
  cards: RepaymentCard[];
  /** Which of the two people is looking, for the wording only. */
  role?: "borrower" | "coBorrower";
  /** Fill the row's height. Only true where it shares a row. */
  fill?: boolean;
  /** WBS story 8: replace mode. The old card is gone once this returns. */
  onSaveCard?: (card: CardToken, replacing?: RepaymentCard) => void;
};

export function RepaymentCardPanel({
  title,
  cards,
  role = "borrower",
  fill = false,
  onSaveCard,
}: RepaymentCardPanelProps) {
  const t = useT();
  /** `undefined` = the dialog is closed. A card = that card is being replaced. */
  const [replacing, setReplacing] = useState<RepaymentCard>();
  const [adding, setAdding] = useState(false);
  /** What Repay handed back and the applicant has not agreed to save yet. */
  const [pending, setPending] = useState<CardToken>();

  const open = adding || replacing !== undefined;
  const close = () => {
    setAdding(false);
    setReplacing(undefined);
    setPending(undefined);
  };

  /**
   * The one card that can be updated, if there is one.
   *
   * Replace mode means there is only ever one active card, so this is the
   * card, not a list.
   */
  const active = cards.find((card) => card.active);

  const shell = (children: React.ReactNode, extra?: React.ReactNode) => (
    <Card
      title={title}
      extra={extra}
      style={fill ? styles.card : undefined}
      styles={fill ? { body: styles.fillBody } : undefined}
    >
      {children}
    </Card>
  );

  /*
    THE DIALOG. Repay's form, the replace warning where one applies, and one
    question before the token is kept. Rendered beside whichever panel state
    is showing, so the panel never changes shape when it opens.
  */
  const dialog = (
    <>
      <Modal
        open={open && pending === undefined}
        title={replacing ? t("card.update") : t("payments.addCard")}
        onCancel={close}
        footer={null}
        width={520}
        destroyOnHidden
      >
        <Flex vertical gap={16} style={styles.dialog}>
          {replacing ? (
            /* Story 8 in one sentence: this is not "add another card". */
            <Alert
              type="warning"
              showIcon
              title={t("payments.replaceTitle")}
              description={t("payments.replaceBody", { last4: replacing.last4 })}
            />
          ) : null}
          <ExternalPanel provider={t("card.external")} note={t("card.externalNote")}>
            <RepayCardForm onSave={setPending} onCancel={close} />
          </ExternalPanel>
        </Flex>
      </Modal>

      <ConfirmModal
        open={pending !== undefined}
        title={t("payments.saveCardTitle")}
        body={t(replacing ? "payments.saveCardBodyReplace" : "payments.saveCardBody", {
          last4: replacing?.last4 ?? "",
        })}
        confirmLabel={t("payments.saveCardConfirm")}
        onConfirm={() => {
          if (pending) onSaveCard?.(pending, replacing);
          close();
        }}
        /* Cancel keeps the dialog open on the form, so a wrong number can be
           retyped rather than re-entered from the start. */
        onCancel={() => setPending(undefined)}
      />
    </>
  );

  if (cards.length === 0) {
    return (
      <>
        {shell(
          <Flex vertical>
            <EmptyState
              title={t("payments.noCard")}
              description={t(
                role === "coBorrower" ? "payments.noCardCo" : "payments.noCardBody"
              )}
            />
            <Flex justify="center">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAdding(true)}
              >
                {t("payments.addCard")}
              </Button>
            </Flex>
          </Flex>
        )}
        {dialog}
      </>
    );
  }

  return (
    <>
      {shell(
        <Flex vertical>
      {cards.map((card, index) => (
        <Flex vertical key={card.id}>
          {index > 0 ? <Divider style={styles.rule} /> : null}
          <SavedCardFace card={card} />
        </Flex>
      ))}

          {/* Story 7's privacy line, said to whoever is reading it. Without it
              the co-borrower's single card looks like the whole account's. */}
          <Typography.Text type="secondary" style={styles.privacy}>
            {t("payments.cardPrivacy")}
          </Typography.Text>
        </Flex>,
        /* Beside the title, as a link. A full-width bordered button under the
           card face was the heaviest thing in the panel and the second thing
           the eye landed on, for an action almost nobody takes — a card gets
           replaced when it expires or is lost. The head's right-hand slot is
           where a card's own action belongs, and a link is the weight it
           deserves. */
        active ? (
          <Button
            type="link"
            style={styles.headAction}
            onClick={() => setReplacing(active)}
          >
            {t("card.update")}
          </Button>
        ) : undefined
      )}
      {dialog}
    </>
  );
}

export default RepaymentCardPanel;
