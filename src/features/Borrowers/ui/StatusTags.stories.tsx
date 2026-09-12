// Every state a borrower's row can be in, side by side — the quickest way to
// check that only the outcomes carry colour.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "antd";
import { ApplicationStatusTag, DoNotLoanTag, LoanStatusTag } from "./StatusTags";

const meta = {
  title: "Borrowers/Status tags",
  component: ApplicationStatusTag,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ApplicationStatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  args: { status: "approved" },
  render: () => (
    <Flex vertical gap={16}>
      <Flex gap={8} wrap>
        <ApplicationStatusTag status="none" />
        <ApplicationStatusTag status="submitted" />
        <ApplicationStatusTag status="review" />
        <ApplicationStatusTag status="coBorrower" />
        <ApplicationStatusTag status="approved" />
        <ApplicationStatusTag status="declined" />
      </Flex>
      <Flex gap={8} wrap>
        <LoanStatusTag status="funded" />
        <LoanStatusTag status="repaying" />
        <LoanStatusTag status="closed" />
      </Flex>
      <Flex gap={8}>
        <DoNotLoanTag />
      </Flex>
    </Flex>
  ),
};
