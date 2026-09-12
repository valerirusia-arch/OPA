// Step 1 of registration: the fields the identity check runs against.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PersonalInfoStep } from "./PersonalInfoStep";

const meta = {
  title: "Auth/Personal info step",
  component: PersonalInfoStep,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 660 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PersonalInfoStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { onBack: () => {} } };

export const DuplicateSsn: Story = {
  args: {
    onBack: () => {},
    fieldErrors: [{ name: "ssn", errors: ["This SSN is already on file"] }],
  },
};
