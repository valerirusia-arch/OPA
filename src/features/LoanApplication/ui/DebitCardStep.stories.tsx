// Every state of the debit-card step, including the two that only a processor
// can produce — a saved card and a refusal — which the running app cannot
// reach on its own.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DebitCardStep } from "./DebitCardStep";

const meta: Meta<typeof DebitCardStep> = {
  title: "Loan application/Debit card",
  component: DebitCardStep,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof DebitCardStep>;

export const NoCardYet: Story = {};

export const CardSaved: Story = {
  args: { card: { brand: "Visa", last4: "6753", expiry: "08/28" } },
};

export const Mastercard: Story = {
  args: { card: { brand: "Mastercard", last4: "4417", expiry: "11/27" } },
};

/** An unrecognised prefix: the badge falls back to an icon, never to "CARD". */
export const UnknownNetwork: Story = {
  args: { card: { brand: "Card", last4: "1908", expiry: "03/29" } },
};

/**
 * WBS: "Only U.S. debit cards are supported." OPA cannot tell debit from
 * credit — Repay refuses, and this is that refusal arriving.
 */
export const Declined: Story = {
  args: {
    declined:
      "Repay could not accept this card. Use a US debit card. Credit cards are not supported.",
  },
};
