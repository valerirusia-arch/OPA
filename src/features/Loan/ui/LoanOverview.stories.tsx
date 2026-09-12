// Every stage of an application and its loan, in the order they happen. Only
// one is reachable by walking the app, so this is where the rest are judged.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoanOverview } from "./LoanOverview";
import {
  mockAwaitingSignature,
  mockCancelled,
  mockCardUsed,
  mockDeclined,
  mockFunded,
  mockUnderReview,
} from "../../../flows/loan/mockLoan";

const meta = {
  title: "Manage loan/Loan overview",
  component: LoanOverview,
  parameters: { layout: "padded" },
  /* Present, not just typed: the card link and the schedule link only render
     where the page can act on them. */
  args: {
    onStartApplication: () => {},
    onWithdraw: () => {},
    onSign: () => {},
    onOpenCard: () => {},
    onCancelLoan: () => {},
    onViewSchedule: () => {},
    onDownload: () => {},
  },
} satisfies Meta<typeof LoanOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No application at all. */
export const NoApplication: Story = { args: { application: undefined } };

/** WBS story 5: withdrawing is available only before the final decision. */
export const UnderReview: Story = { args: { application: mockUnderReview } };

/** WBS story 2: documents become signable only after approval. */
export const AwaitingSignature: Story = { args: { application: mockAwaitingSignature } };

/** WBS stories 7, 8, 9: card issued and unused, so cancelling is still open. */
export const Funded: Story = { args: { application: mockFunded } };

/** WBS story 9's window has closed: the card has been used. */
export const CardUsed: Story = { args: { application: mockCardUsed } };

/**
 * WBS story 7: "Co-borrower has no access to card information." Same loan,
 * different reader.
 */
export const AsCoBorrower: Story = {
  args: { application: mockFunded, role: "coBorrower" },
};

/** Customer-facing decision detail only: no score, no rule, no check name. */
export const Declined: Story = { args: { application: mockDeclined } };

/**
 * WBS story 9, after the fact: the card is closed and nothing was paid out, so
 * there is no balance, schedule or card left to show — only the documents,
 * which "remain available throughout the loan lifecycle".
 */
export const Cancelled: Story = { args: { application: mockCancelled } };
