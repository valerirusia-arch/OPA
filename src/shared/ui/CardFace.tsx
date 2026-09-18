// src/shared/ui/CardFace.tsx
//
// A payment card, drawn as a card.
//
// TWO PAGES SHOW A CARD AND THEY ARE NOT THE SAME CARD. The payments page
// shows the debit card the borrower REPAYS with, tokenised by Repay; the loan
// page shows the virtual card OPA ISSUES through USIO to pay the USCIS fee.
// Different providers, different directions of money — and to the borrower,
// both are "my card", so both are drawn the same way. One treatment here, two
// thin adapters over it, rather than each page inventing its own idea of what
// a card looks like.
//
// Laid out where the facts sit on a real card: what it is at the top, the
// number across the middle, the small print at the foot. That arrangement is
// what makes it recognisable without an icon to announce it, and it is why the
// row this replaced read as a form field — a badge on one left edge, the text
// on a second, a button on a third.
//
// LIGHTENED, 2026-09-11: *"ბარათის ვიზუალიც არ მომწონს, ეგეც მძიმეა."* Three
// things went, and none of them was a fact:
//   · the full four-group mask. Sixteen dots is a wall of ink to say "we do
//     not have the number"; `•••• 4417` is how the rest of the product already
//     writes a card, and the last four are the only part anybody reads.
//   · the "EXPIRES" label over its value in its own corner block — two lines
//     and a second alignment for four characters. It is one quiet line under
//     the number now.
//   · a step of size off the number, and the row gaps with it.
//
// A FILL, NOT A BORDER. It sits inside a Card of its own, and a bordered box
// inside a bordered box is a nested card. The recessed fill is the product's
// own way of saying "a surface within a surface" — the same one behind every
// input and the Segmented track.
//
// THE FINISH SAYS WHOSE CARD IT IS — eventually. Two were tried first, a
// white one dissolving into pale blue and a deep navy, with the plan that
// dark meant OPA's and light meant the borrower's. Side by side on the real
// pages the answer was shorter: *"ის დიზაინი ჯობია, მუქი."* So both wore the
// navy, and with the mock handing them the same four digits as well, the two
// cards became indistinguishable — which is wrong, because they are opposite
// objects: OPA issues one and spends it, the borrower brings the other and is
// charged on it.
//
// A third finish settles it, and the rebrand decided which way round it goes:
// OPA'S CARD IS THE BRAND TEAL, the borrower's own a warm graphite. Same
// geometry, same type, same white ink — one object in two materials, not two
// designs. OPA takes the identity colour because OPA issues that card; the
// borrower's is neutral because it is not OPA's to brand. Both are flat solid
// fills, no gradient and no bloom.
// `tone="light"` stays: it is drawn, it works, and it is one prop away.
//
// STILL NOT A REPLICA. No brand artwork, no logo, no hologram, no magnetic
// stripe — and NO CHIP either. One was drawn, at real proportions and in
// brushed metal, on the argument that it is what makes a rectangle read as a
// card; the designer's answer was to take it out of the design entirely. It
// was the one element here that is a picture of an object rather than a fact
// about it, and the finishes carry the recognition on their own.
//
// Dumb: it renders a token.

import { Flex, Tag, Typography, theme } from "antd";
import { pill } from "./tag.styles";
import { getFigureStyles } from "./figures.styles";
import { CardBrandMark } from "./CardBrandMark";
import { Logo } from "./Logo";
import { frontStyles, getStyles, styles, type CardTone } from "./CardFace.styles";

export type CardFaceProps = {
  /**
   * Which finish. It used to be the ONLY thing that said whose card this is —
   * graphite for the card OPA issues, navy for the one the borrower brought —
   * which was too quiet a signal on its own. `owner` now says it in words too.
   * `light` is the pale finish the pair was first drawn in, kept and not in use.
   */
  tone?: CardTone;
  /**
   * Whose card this is, in words, along the top of the face: "Issued by OPA"
   * on the virtual card, "Your card" on the borrower's own. The finish carries
   * the same distinction visually; this makes it unmistakable — *"რომ
   * მანახებს, რომ ეს ოპას ბარათია, ეს ჩემი ბარათია."*
   */
  owner?: string;
  /**
   * Top left: what this card is, in the product's own label treatment.
   *
   * Superseded by `brand` when the network is known — a VISA mark over the
   * words "Visa debit" says it twice — and still the accessible name and the
   * fallback for a card whose network the product has not been told.
   */
  label: string;
  /**
   * The payment network, as the product stores it. Drawn as the network's
   * own mark in the label's place; see `CardBrandMark`.
   */
  brand?: string;
  /** Top right: one word about its state. `color` is an antd Tag colour. */
  status?: { label: string; color?: string };
  /** The masked number. `•••• 1234` — the shorthand, not the full mask. */
  number: string;
  /**
   * The small print along the foot.
   *
   * ONE fact is drawn as a quiet line under the number — an expiry needs no
   * label above it to be understood. TWO OR MORE become the labelled row a
   * real card has: holder, expiry, and the security code when USIO is the one
   * showing it. Same object either way, which is the point: the panel, the
   * dialog and the revealed card are one card in three states, not three
   * drawings of a card.
   */
  facts?: { key: string; label: string; value: string }[];
  /** The number can be copied. Only where it IS a number — a mask cannot. */
  copyable?: boolean;
  /**
   * THE FRONT OF OPA'S OWN CARD, as OPA prints it.
   *
   * Three things and no more: the mark top left, the card's state top right,
   * and the masked number along the foot. Those are facts OPA is allowed to
   * hold — a token's last four and whether it has been spent — so the front
   * may carry them. What it may not carry is the rest: the WBS puts the full
   * number, the expiry and the security code behind USIO's secure embedded
   * view, and they arrive on the revealed face instead.
   *
   * `facts` is still accepted and simply not printed here.
   */
  front?: boolean;
};

export function CardFace({
  tone = "borrower",
  owner,
  label,
  brand,
  status,
  number,
  facts = [],
  copyable = false,
  front = false,
}: CardFaceProps) {
  /* Both of the product's real finishes are dark: they take white ink, and
     they print their own status pill rather than wearing antd's chip. Only
     the unused pale-blue one does neither. */
  const inverted = tone !== "light";
  const { token } = theme.useToken();
  const s = getStyles(token, tone);
  const figures = getFigureStyles(token);

  /* OPA'S OWN FRONT. It returns early rather than threading `front` through
     six branches below, because it genuinely is a different drawing: not this
     face with things switched off, but the front of the card OPA issues —
     see `frontStyles`. */
  if (front) {
    return (
      <Flex vertical justify="space-between" gap={20} style={s.face}>
        <Flex align="flex-start" justify="space-between" gap={12}>
          <div style={frontStyles.mark}>
            <Logo height={36} />
          </div>
          {/* Top right, printed on the card rather than stuck to it — the same
              pill cut from the face's own material that the revealed card
              wears. It was in the panel's head; the designer put it back on
              the card, where a card's own state belongs. */}
          {status ? (
            <Tag variant="filled" style={{ ...pill, ...s.cutPill }}>
              {status.label}
            </Tag>
          ) : null}
        </Flex>

        {/* THE NUMBER, THEN THE FOOT — a card's own arrangement.

            The masked number was alone on the bottom line; it moves up a step
            and the line under it carries the two things printed along the foot
            of a real card: the name on the left, the expiry in the corner
            opposite. *"სადაც ანგარიში წერია, მანდ სახელი დააწერე; ანგარიში
            ოდნავ მაღლა აწიე; და დეითი მარჯვენა კუთხეში დაბლა."*

            VALUES ONLY, no labels: a card does not introduce its own expiry,
            and the two are told apart by where they sit. `facts` in order —
            the first left, the last right — so the caller decides what is
            printed by what it passes, and passing one prints one. */}
        <Flex vertical gap={14}>
          <Typography.Text style={s.number}>{number}</Typography.Text>

          {facts.length > 0 ? (
            <Flex align="flex-end" justify="space-between" gap={16}>
              <Typography.Text style={s.footValue}>{facts[0].value}</Typography.Text>
              {facts.length > 1 ? (
                <Typography.Text style={s.footValue}>
                  {facts[facts.length - 1].value}
                </Typography.Text>
              ) : null}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex vertical justify="space-between" gap={20} style={s.face}>
      {/* The ownership eyebrow, then what the card is — grouped so the top of
          the face reads "whose card · which card" and the number holds the
          base. */}
      <Flex vertical gap={owner ? 10 : 0}>
        {owner ? (
          <Typography.Text style={s.owner}>{owner}</Typography.Text>
        ) : null}
        <Flex align="center" justify="space-between" gap={12}>
        {/* THE NETWORK'S MARK WHERE THE CARD ITSELF CARRIES IT. A person
            checking which card is on file recognises the mark before they
            read anything, and the brand is one of the four facts OPA is
            actually allowed to hold about a card. Without one — a card whose
            network the product was never told — the line of type stands in
            and says what the card is instead. */}
        {brand ? (
          <CardBrandMark brand={brand} onDark={inverted} />
        ) : (
          <Typography.Text style={{ ...figures.microLabel, ...s.label }}>
            {label}
          </Typography.Text>
        )}
        {/* CUT FROM THE CARD, not stuck on it. antd's filled tag is a pale
            chip, which reads as a white sticker on the navy and as a white
            sticker on the mint. Each finish mixes the pill from its own
            material instead, the way a real card's printing is part of the
            card. The status COLOUR goes with it, on both: a card face is not
            where a borrower reads a state — the panel around it says the same
            thing in words. */}
        {status ? (
          <Tag
            color={inverted ? undefined : status.color}
            variant="filled"
            style={inverted ? { ...pill, ...s.cutPill } : pill}
          >
            {status.label}
          </Tag>
        ) : null}
        </Flex>
      </Flex>

      {/* The number and its small print as one block: a card's expiry is a
          footnote to its number, not a second fact in the opposite corner.
          Omitted rather than left as an empty row — OPA has an expiry for the
          card it is given (Repay) and none for the card it issues (USIO), and
          a blank line reserved for a fact that does not exist is just a gap. */}
      <Flex vertical gap={4}>
        <Typography.Text
          style={s.number}
          copyable={copyable ? { text: number, tooltips: false } : false}
        >
          {number}
        </Typography.Text>

        {facts.length > 1 ? (
          <Flex align="flex-end" justify="space-between" gap={20} style={styles.foot}>
            {facts.map((fact) => (
              <Flex vertical gap={2} key={fact.key}>
                <Typography.Text style={s.footLabel}>{fact.label}</Typography.Text>
                <Typography.Text style={s.footValue}>{fact.value}</Typography.Text>
              </Flex>
            ))}
          </Flex>
        ) : facts.length === 1 ? (
          <Typography.Text style={s.meta}>
            {`${facts[0].label} ${facts[0].value}`}
          </Typography.Text>
        ) : null}
      </Flex>
    </Flex>
  );
}

export default CardFace;
