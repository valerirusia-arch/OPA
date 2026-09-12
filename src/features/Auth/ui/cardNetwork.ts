// src/features/Auth/ui/cardNetwork.ts
//
// Which network issued a card number, from its leading digits.
//
// The IIN ranges and the lengths that go with them are published by the
// networks, which makes them the one thing about a card a form can settle by
// itself. Whether the card EXISTS, has money on it, or is a debit rather than
// a credit card are all the processor's answers — the WBS is explicit that
// those come back from Repay — but "this is not the shape of any card number"
// is answerable here, before anybody waits on a network.
//
// It is why "1313 1331 3131 3133 133" gets refused: it is the right length for
// a 19-digit Visa and it even passes the checksum by luck, but no network
// issues numbers beginning with 1.
//
// Pure functions on a string of digits. Presentation only.

export type CardNetwork = {
  /** How the network is written back to the borrower. */
  name: string;
  /** The lengths that network actually issues. */
  lengths: number[];
};

const NETWORKS: Array<CardNetwork & { test: RegExp }> = [
  { name: "Visa", test: /^4/, lengths: [13, 16, 19] },
  // 51–55 is the old range; 2221–2720 is the 2-series Mastercard added in 2017.
  { name: "Mastercard", test: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/, lengths: [16] },
  { name: "Amex", test: /^3[47]/, lengths: [15] },
  { name: "Discover", test: /^(6011|64[4-9]|65)/, lengths: [16, 17, 18, 19] },
];

/** The network whose range these digits fall in, or undefined for none. */
export const cardNetwork = (digits: string): CardNetwork | undefined =>
  NETWORKS.find((network) => network.test.test(digits));

/**
 * The Luhn checksum every card number carries in its last digit.
 *
 * It catches a mistyped or transposed digit in a number that is otherwise the
 * right shape — the last check available before the processor's.
 */
export const passesLuhn = (digits: string) => {
  let sum = 0;
  let double = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let value = Number(digits[index]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }

  return sum % 10 === 0;
};

/** Amex prints a 4-digit code; every other network prints 3. */
export const cvvLength = (digits: string) =>
  cardNetwork(digits)?.name === "Amex" ? 4 : 3;

/**
 * The networks' own published test numbers.
 *
 * Not a convenience: once the form checks IIN ranges, lengths and the Luhn
 * checksum — which is what a card form owes its user — a made-up string cannot
 * get through it, and clicking your own prototype should not require knowing
 * that Mastercard stops at 55. These are the numbers every processor documents
 * for exactly this, and they belong beside the rules that accept them so the
 * two can never drift.
 *
 * DEV only at the call site: the button that uses them never renders in a
 * build.
 */
export const TEST_CARDS = [
  { number: "4111111111111111", cvv: "111" },
  { number: "5555555555554444", cvv: "222" },
  { number: "378282246310005", cvv: "3333" },
  { number: "6011111111111117", cvv: "444" },
];
