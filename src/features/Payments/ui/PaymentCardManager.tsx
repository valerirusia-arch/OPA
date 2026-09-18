// src/features/Payments/ui/PaymentCardManager.tsx
//
// Managing the debit card OPA repays from, on the PROFILE page — drawn exactly
// the way the application collects it. The card is no longer a panel on the
// payments page; the designer moved it here, and asked that adding or replacing
// it look the same as it does in the wizard's debit-card step.
//
// So it composes the SAME pieces that step does: Repay's embedded form inside
// an `ExternalPanel` that names the provider, the `CardOnFile` row once a token
// is held, and the "enter card" button when there is none. No StepActions —
// this is not a step in a flow, it is a section a user opens to keep their card
// current. WBS story 6 (collection) and story 8 (replace mode) both hold: the
// old token stays until Repay hands back a new one.
//
// Dumb: local "is the form open" state; the token leaves by callback.

import { useState } from "react";
import { Button } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useT } from "../../../shared/ui/i18n/useT";
import { CardOnFile } from "../../LoanApplication/ui/CardOnFile";
import { ExternalPanel } from "../../LoanApplication/ui/ExternalPanel";
import { RepayCardForm } from "../../LoanApplication/ui/RepayCardForm";
import type { CardToken } from "../../LoanApplication/ui/types";

export type PaymentCardManagerProps = {
  /** The token on file, if any. A RepaymentCard satisfies this shape. */
  card?: CardToken;
  /** Repay handed back a new token. `replacing` is true when one was on file. */
  onSaveCard?: (card: CardToken, replacing: boolean) => void;
};

export function PaymentCardManager({ card, onSaveCard }: PaymentCardManagerProps) {
  const t = useT();
  /** Local UI state: whether Repay's form is open. Nothing else. */
  const [entering, setEntering] = useState(false);

  return (
    <ExternalPanel provider={t("card.external")} note={t("card.externalNote")}>
      {entering ? (
        <RepayCardForm
          onSave={(saved) => {
            setEntering(false);
            onSaveCard?.(saved, Boolean(card));
          }}
          onCancel={() => setEntering(false)}
        />
      ) : card ? (
        <CardOnFile card={card} onReplace={() => setEntering(true)} />
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
  );
}

export default PaymentCardManager;
