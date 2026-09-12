import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/react-vite",
  // Storybook and the app both run Vite. Sharing node_modules/.vite makes them
  // re-optimise over each other on every start; give Storybook its own cache.
  viteFinal: (config) => ({ ...config, cacheDir: "node_modules/.vite-storybook" }),
};

export default config;
