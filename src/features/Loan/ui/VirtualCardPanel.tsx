// src/features/Loan/ui/VirtualCardPanel.tsx
//
// WBS story 7 — "Borrower shall be able to securely access the issued virtual
// payment card information." The wireframe's "Your Virtual Card" card: the
// last four, whether it has been used, and a way through to the card itself.
//
// Two rules from the WBS shape it, and both are refusals:
//
//   "Card details are NOT stored, processed or transmitted by OPA application
//    and are accessible only via a secure embedded view/directly on USIO and
//    is working as a 'black box' for OPA application."
//   → nothing on this card is a secret being withheld. The number is not here
//     to reveal; what the panel holds is a door.
//
//   "Only the Borrower can access the virtual payment card. Co-borrower has no
//    access to card information."
//   → the co-borrower's wireframe simply has no card on it, so neither does
//     this. The screen does not render the panel for them at all, which is a
//     stronger guarantee than a panel that decides to say no.
//
// IT IS DRAWN BY THE SAME COMPONENT AS THE PAYMENTS PAGE'S SAVED CARD, and it
// owns its own Card for the same reason that one does: the hand-off to USIO
// belongs beside the title, at a link's weight, not as the heaviest element in
// the panel. Two pages that both show "my card" now show it identically.
//
// Dumb: it renders a masked reference and reports a click.

import { Button, Card, Flex, Typography } from "antd";
import { CardFace } from "../../../shared/ui/CardFace";
import { useT } from "../../../shared/ui/i18n/useT";
import { styles } from "./VirtualCardPanel.styles";

export type VirtualCardPanelProps = {
  /** The card's heading. The screen supplies it; the head lives here. */
  title: string;
  /** The network USIO issued it on, where OPA has said which. Absent, the
   *  face prints the issuer line instead. */
  brand?: string;
  /*
    NEITHER THE LAST FOUR NOR THE EXPIRY ARE PROPS ANY MORE — the face stopped
    printing digits and the panel wanted them for nothing else. Both still
    reach the screen, in the details dialog, from the same record the screen
    reads.
  */
  /** The name printed along the foot, where a card carries it. */
  cardholder: string;
  /** Once it is, story 9's cancellation window has closed. */
  used: boolean;
  /** Fill the row's height. Only true where it shares a row. */
  fill?: boolean;
  onOpen?: () => void;
};

export function VirtualCardPanel({
  title,
  brand,
  cardholder,
  used,
  fill = false,
  onOpen,
}: VirtualCardPanelProps) {
  const t = useT();

  return (
    <Card
      title={title}
      style={fill ? styles.card : undefined}
      styles={fill ? { body: styles.fillBody } : undefined}
      /* The only control OPA can offer: a way out to the people who actually
         hold the card. In the head, as a link, exactly like "Update" on the
         saved card — a hand-off is not a primary action. */
      extra={
        <Button type="link" style={styles.headAction} onClick={onOpen}>
          {t("loanPage.cardOpen")}
        </Button>
      }
    >
      {/* Face at its own height with the note under it — the same two-part
          body the saved card has on /payments, so the two panels read as the
          same object. The face must NOT stretch to the row's height: a card
          that grows into whatever space is left stops looking like a card.

          The issuer sits top left, where the saved card carries its brand,
          and there is no "card ending" label above the digits: a masked
          number does not need to be introduced as one. */}
      <Flex vertical justify={fill ? "center" : "flex-start"} style={styles.body}>
        {/* OPA'S OWN FRONT: the mark on its tile, the card's name along the
            foot, the holder under it and the state in the corner opposite.
            No digits — see the note on `front` in CardFace. */}
        <CardFace
          front
          brand={brand}
          label={t("loanPage.cardTypeValue")}
          status={{
            label: t(used ? "loanPage.cardUsed" : "loanPage.cardUnused"),
          }}
          facts={[{ key: "holder", label: t("loanPage.cardholder"), value: cardholder }]}
        />

        {/* PRODUCT.md's fourth principle: name the hand-over. This is where
            the flow leaves OPA, and it answers "why is my own card number
            hidden from me" — USIO holds the card, OPA holds a token. The same
            sentence is in the modal, which is fine: here it is the reason the
            link exists, there it is the reason the view is somebody else's. */}
        <Typography.Text type="secondary" style={styles.note}>
          {t("loanPage.cardBody")}
        </Typography.Text>
      </Flex>

    </Card>
  );
}

export default VirtualCardPanel;
