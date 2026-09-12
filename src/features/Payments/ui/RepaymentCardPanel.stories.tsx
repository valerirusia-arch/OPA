// WBS stories 7 and 8. The empty state is the one worth looking at: a
// co-borrower who has added nothing sees no card at all, and has to be able
// to tell that from a broken page.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { RepaymentCardPanel } from "./RepaymentCardPanel";
import { mockAsCoBorrower, mockCurrent } from "../../../flows/payments/mockPayments";

const meta = {
  title: "Manage payments/Repayment card",
  component: RepaymentCardPanel,
  parameters: { layout: "padded" },
  /* The panel owns its Card, so the heading is a prop rather than a wrapper. */
  args: { title: "Saved payment card" },
} satisfies Meta<typeof RepaymentCardPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** WBS story 7: masked, brand, expiry, and that it is the active method. */
export const OnFile: Story = { args: { cards: mockCurrent.cards } };

/** The co-borrower's own card. Neither party is handed the other's. */
export const CoBorrowersOwn: Story = {
  args: { cards: mockAsCoBorrower.cards, role: "coBorrower" },
};

/** Nothing added yet. Story 8's replace flow has nothing to replace. */
export const Empty: Story = { args: { cards: [] } };

/** The same, read by a co-borrower, who is told why it is empty. */
export const EmptyAsCoBorrower: Story = { args: { cards: [], role: "coBorrower" } };

/** A card that is no longer the active method: shown, not offered a replace. */
export const NotInUse: Story = {
  args: { cards: [{ ...mockCurrent.cards[0], active: false }] },
};
