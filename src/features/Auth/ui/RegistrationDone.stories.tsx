// The last step of registration: the account exists, and the next thing to do
// is start an application. Here so the illustration and the two-line message
// can be judged without walking eight steps to reach them.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegistrationDone } from "./RegistrationDone";

const meta = {
  title: "Auth/Registration done",
  component: RegistrationDone,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 460 }}><Story /></div>],
  args: { email: "maria.alvarez@example.com" },
} satisfies Meta<typeof RegistrationDone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A long address is the case that used to break the message across a clause. */
export const LongEmail: Story = {
  args: { email: "maria.alejandra.alvarez.rodriguez@example-domain.com" },
};
