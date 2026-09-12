// Step 3 of registration: the password the borrower will sign in with.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountStep } from "./AccountStep";

const meta = {
  title: "Auth/Account step",
  component: AccountStep,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 660 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { onBack: () => {} } };

/** Some rules only the server knows, e.g. a password found in a breach list. */
export const RejectedPassword: Story = {
  args: {
    onBack: () => {},
    fieldErrors: [
      { name: "password", errors: ["This password has appeared in a data breach"] },
    ],
  },
};

/** Whether an address is already registered is the server's answer, not ours. */
export const DuplicateEmail: Story = {
  args: {
    onBack: () => {},
    initialValues: { email: "levi@example.com" },
    fieldErrors: [{ name: "email", errors: ["This email is already registered"] }],
  },
};
