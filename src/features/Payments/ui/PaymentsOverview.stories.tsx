// Every state of the payments page. Almost all of them are states nobody wants
// to be in, and those are exactly the ones that go unreviewed if the only way
// to see them is to be in them: the route renders one record.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaymentsOverview } from "./PaymentsOverview";
import {
  mockAccelerated,
  mockAllOutcomes,
  mockAsCoBorrower,
  mockCurrent,
  mockDefault,
  mockNoCard,
  mockOverdue,
  mockPaidOff,
} from "../../../flows/payments/mockPayments";

const meta = {
  title: "Manage payments/Payments overview",
  component: PaymentsOverview,
  parameters: { layout: "padded" },
  /* The handlers have to be present, not just typed: the Pay and the Try
     again columns render only where the page can act, so a story without them
     hides the two controls it exists to show. */
  args: {
    onPay: () => {},
    onRetry: () => {},
    onSaveCard: () => {},
    onViewLoan: () => {},
  },
} satisfies Meta<typeof PaymentsOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** WBS stories 2, 3 and 4 with nothing going wrong. */
export const Current: Story = { args: { record: mockCurrent } };

/** No loan funded yet, so there is nothing to repay. */
export const NoLoan: Story = { args: { record: undefined } };

/**
 * WBS story 9: 22 days late, so the late fee was charged on the 16th day. It
 * is $5.00 rather than 5% because 5% of the installment is more than that.
 */
export const Overdue: Story = { args: { record: mockOverdue } };

/** More than 90 days past due: "the full past due balance must be paid within
 *  30 days to avoid loan acceleration". */
export const InDefault: Story = { args: { record: mockDefault } };

/** More than 120 days: the whole remaining balance is due, APR still 1%. */
export const Accelerated: Story = { args: { record: mockAccelerated } };

/** WBS story 4's five outcomes, on one page. Four of them never occur in a
 *  happy demo, and each needs a colour, a word and a reason. */
export const EveryOutcome: Story = { args: { record: mockAllOutcomes } };

/** WBS story 7: a co-borrower who has not added a card sees none, because the
 *  borrower's is not theirs to see. Not an error state. */
export const NoCard: Story = { args: { record: mockNoCard, role: "coBorrower" } };

/** The same loan, read by the co-borrower: their own card and no other. */
export const AsCoBorrower: Story = {
  args: { record: mockAsCoBorrower, role: "coBorrower" },
};

/** WBS story 6's other ending: repaid before the maturity date. */
export const PaidOff: Story = { args: { record: mockPaidOff } };
