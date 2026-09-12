// src/features/Payments/ui/SavedCardFace.tsx
//
// The saved debit card, mapped onto the shared card face.
//
// WBS story 7 lists what it shows and nothing else: "masked card details, card
// brand, expiration date, and whether the card is currently used as the active
// repayment method." Four facts, and this file is the four facts — where they
// sit on the face and what a card looks like is `shared/ui/CardFace`, because
// the loan page's virtual card is drawn by the same thing.
//
// Dumb: it renders a token.

import { CardFace } from "../../../shared/ui/CardFace";
import { useT } from "../../../shared/ui/i18n/useT";
import type { RepaymentCard } from "./types";

export type SavedCardFaceProps = {
  card: RepaymentCard;
};

export function SavedCardFace({ card }: SavedCardFaceProps) {
  const t = useT();

  return (
    <CardFace
      /* The network draws itself top left; the words stay as the accessible
         name and as the fallback for a brand the mark does not cover. */
      brand={card.brand}
      label={t("card.brandLine", { brand: card.brand })}
      /* WBS story 7's fourth fact. */
      status={{
        label: t(card.active ? "card.active" : "card.inactive"),
        color: card.active ? "success" : undefined,
      }}
      number={t("payments.cardEnding", { last4: card.last4 })}
      facts={[
        { key: "expires", label: t("card.expiresLabel"), value: card.expiry },
      ]}
    />
  );
}

export default SavedCardFace;
