// src/features/LoanApplication/ui/DebitCardStep.tsx
//
// WBS story 6 (and story 12, the co-borrower's half of it).
//
// The WBS could not be more specific about who owns this: "DEBIT only card
// details are collected using a secure embedded form from Repay that works as
// a 'black box' for the OPA application. No card information is stored in the
// OPA application, only card token."
//
// So OPA does not draw a card form. The wireframe did — card number, expiry,
// CVV, in OPA's own fields — and that would tell the borrower they are handing
// their card to OPA. They are not. The area belongs to Repay, is labelled as
// Repay's, and what comes back into OPA is a token: a brand and four digits.
//
// The fields themselves are a MOCK of Repay's form (see RepayCardForm), shown
// inside the panel so a reviewer can watch the whole step happen. Once it is
// saved, what remains on screen is the token: brand, last four, expiry, drawn
// as the card on file.
//
// Dumb: nothing is sent; "saving" is local state and a console.log.

import { useState } from "react";
import { Alert, Button, Flex } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { CardOnFile } from "./CardOnFile";
import { ExternalPanel } from "./ExternalPanel";
import { RepayCardForm } from "./RepayCardForm";
import { StepActions, type StepActionLabels } from "./StepActions";
import { styles, styles as shared } from "./StepShared.styles";
import type { CardToken } from "./types";

export type DebitCardStepProps = {
  /** Button wording, overridden when the step opens in the review's dialog. */
  labels?: StepActionLabels;
  /** What Repay handed back, once a card has been entered. */
  card?: CardToken;
  /**
   * Repay refused the card, and why.
   *
   * WBS: "Only U.S. debit cards are supported." OPA cannot tell a debit card
   * from a credit one — that is the network's answer, from the BIN — so the
   * copy above can warn but not enforce. The refusal comes back from Repay
   * and has to land somewhere, and this is where.
   */
  declined?: string;
  onEnterCard?: (card: CardToken) => void;
  /**
   * The borrower asked to enter a different card.
   *
   * A notice, not a removal: the token stays until `onEnterCard` replaces it.
   */
  onReplaceCard?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
};

export function DebitCardStep({
  labels,
  card,
  declined,
  onEnterCard,
  onReplaceCard,
  onSubmit,
  onBack,
}: DebitCardStepProps) {
  const t = useT();
  /** Local UI state: whether Repay's form is open. Nothing else. */
  const [entering, setEntering] = useState(false);
  /**
   * A refusal always reopens the form.
   *
   * Repay says no AFTER the details were submitted, so the borrower is looking
   * at a step they thought they had finished. Showing them the error over a
   * closed form would leave them to work out that they have to press "Enter
   * card details" again — the fields belong on screen with the reason.
   */
  const showForm = entering || Boolean(declined);

  return (
    <Flex vertical>
      <ExternalPanel provider={t("card.external")} note={t("card.externalNote")}>
        {/*
          The open form wins over the card on file, and the card on file is
          what the borrower comes back to.

          Asking to replace a card is not the same as removing one. The token
          on file stays valid until Repay hands back another; if the borrower
          changes their mind, or Repay refuses the new card, cancelling drops
          them back onto the card they already had rather than onto an empty
          step they now have to fill in again.
        */}
        {showForm ? (
          <Flex vertical gap={16} style={styles.form}>
            {declined ? (
              <Alert type="error" showIcon title={declined} />
            ) : null}
            <RepayCardForm
              onSave={(saved) => {
                setEntering(false);
                onEnterCard?.(saved);
              }}
              onCancel={() => setEntering(false)}
            />
          </Flex>
        ) : card ? (
          <CardOnFile
            card={card}
            onReplace={() => {
              setEntering(true);
              onReplaceCard?.();
            }}
          />
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<CreditCardOutlined />}
            onClick={() => {
              console.log("open Repay embedded card form");
              setEntering(true);
            }}
          >
            {t("card.open")}
          </Button>
        )}
      </ExternalPanel>

      <Flex style={shared.actions}>
        <StepActions {...labels} onBack={onBack} onContinue={onSubmit} disabled={!card} />
      </Flex>
    </Flex>
  );
}

export default DebitCardStep;
