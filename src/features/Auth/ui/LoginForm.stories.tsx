// Login states the happy path never shows: a failed attempt with the remaining
// tries, and the locked account the WBS asks for after repeated failures.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginForm } from "./LoginForm";

const meta = {
  title: "Auth/Login form",
  component: LoginForm,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submitting: Story = { args: { submitting: true } };

export const InvalidCredentials: Story = {
  args: { errorMessage: "Invalid email or password." },
};

export const AccountLocked: Story = { args: { locked: true } };
