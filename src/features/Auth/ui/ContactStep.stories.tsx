// Step 2 of registration: address, phone and how to reach the borrower.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactStep } from "./ContactStep";

const meta = {
  title: "Auth/Contact step",
  component: ContactStep,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 660 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { onBack: () => {} } };

/** WBS: OPA only lends in the states it is licensed in. */
export const UnsupportedState: Story = {
  args: {
    onBack: () => {},
    formError: "OPA does not lend in that state yet.",
  },
};
