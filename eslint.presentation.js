// eslint.presentation.js
//
// The Design-in-Code guardrails, as a flat-config FRAGMENT.
//
// This file is APPENDED to the eslint.config.js that SETUP creates — it never
// replaces it. Heads up: the current Vite react-ts template ships oxlint (an
// .oxlintrc.json), NOT eslint, so SETUP removes oxlint and installs the eslint
// baseline (typescript-eslint + react-hooks + react-refresh) this fragment sits
// on top of. Those baseline rules must survive: react-hooks is what catches
// conditional-hook bugs, and `--max-warnings=0` against a config with no real
// rules is a green check that means nothing.
//
// Wiring (see SETUP.md step 9):
//   import { presentationRules } from "./eslint.presentation.js";
//   export default defineConfig([ ...existing, ...presentationRules ]);
//
// Requires: npm i -D eslint-plugin-react

import react from "eslint-plugin-react";

/** Everything a designer owns. Kept in one place — also mirrored in lint-staged. */
const PRESENTATION = [
  "src/shared/ui/**/*.{ts,tsx}",
  "src/features/*/ui/**/*.{ts,tsx}",
  "src/flows/**/*.{ts,tsx}",
  "src/theme/**/*.{ts,tsx}",
  "src/stories/**/*.{ts,tsx}",
];

/**
 * antd already ships all of these. Hand-rolling them is the exact thing this
 * kit exists to prevent, so it's an error, not a code-review conversation.
 *
 * `div` and `span` are deliberately NOT here — they're the layout escape hatch
 * (position: fixed wrappers, spacers). Prefer antd `Flex` / `Space`; reach for
 * a bare div only when there's genuinely nothing to compose.
 */
const HAND_ROLLED = [
  { element: "button", message: "Use antd <Button>." },
  { element: "input", message: "Use antd <Input> / <InputNumber> / <Checkbox> / <Radio>." },
  { element: "select", message: "Use antd <Select>." },
  { element: "textarea", message: "Use antd <Input.TextArea>." },
  { element: "form", message: "Use antd <Form>." },
  { element: "label", message: "Use antd <Form.Item label=...>." },
  { element: "table", message: "Use antd <Table>." },
  { element: "thead", message: "Use antd <Table>." },
  { element: "tbody", message: "Use antd <Table>." },
  { element: "tfoot", message: "Use antd <Table>." },
  { element: "tr", message: "Use antd <Table>." },
  { element: "td", message: "Use antd <Table>." },
  { element: "th", message: "Use antd <Table>." },
  { element: "ul", message: "Use antd <List>." },
  { element: "ol", message: "Use antd <List>." },
  { element: "li", message: "Use antd <List.Item>." },
  { element: "dl", message: "Use antd <Descriptions>." },
  { element: "h1", message: "Use antd <Typography.Title level={1}>." },
  { element: "h2", message: "Use antd <Typography.Title level={2}>." },
  { element: "h3", message: "Use antd <Typography.Title level={3}>." },
  { element: "h4", message: "Use antd <Typography.Title level={4}>." },
  { element: "h5", message: "Use antd <Typography.Title level={5}>." },
  { element: "h6", message: "Use antd <Typography.Title level={5}>." },
  { element: "p", message: "Use antd <Typography.Paragraph>." },
  { element: "a", message: "Use antd <Typography.Link> / <Button href>, or router <Link> for in-app nav." },
  { element: "img", message: "Use antd <Image> / <Avatar>." },
  { element: "hr", message: "Use antd <Divider>." },
  { element: "progress", message: "Use antd <Progress>." },
  { element: "dialog", message: "Use antd <Modal> / <Drawer>." },
];

/**
 * Flat config REPLACES rule options, it does not merge them. Two config objects
 * that both set `no-restricted-imports` for the same files means the LAST one
 * wins and the first one silently does nothing. These bans therefore live in
 * shared consts and are declared together, once — verify with:
 *   npx eslint --print-config src/flows/routes.tsx
 * The result must list axios, zustand AND styled-components.
 */
const LOGIC_IMPORT_PATHS = [
  { name: "axios", message: "No data fetching in presentation. Use Props." },
  { name: "@tanstack/react-query", message: "No React Query in presentation. Use Props." },
  { name: "zustand", message: "No global state in presentation." },
  { name: "zustand/react", message: "No global state in presentation." },
  { name: "zod", message: "Models are dev-owned. A UI component owns its own Props interface." },
  // Navigation is allowed (Link / useNavigate / useParams). Routing LOGIC is not.
  {
    name: "@tanstack/react-router",
    importNames: ["redirect", "useLoaderData", "createRoute", "createRootRoute", "createRouter", "createFileRoute"],
    message: "Navigation only: Link / useNavigate / useParams. Loaders, guards and route wiring live in /app.",
  },
];

// gitignore-style: `**/` so it catches deep + aliased imports, not just siblings.
const LOGIC_IMPORT_PATTERNS = [
  {
    group: [
      "**/api", "**/api/**",
      "**/store", "**/store/**",
      "**/controllers", "**/controllers/**",
      "**/models", "**/models/**",
      "**/app", "**/app/**",
    ],
    message: "UI/flows cannot import from smart layers. Data comes in via Props.",
  },
];

const STYLING_IMPORT_PATHS = [
  { name: "styled-components", message: "antd-only: theme via ConfigProvider tokens (/src/theme), not CSS-in-JS." },
  { name: "@emotion/react", message: "antd-only: theme via ConfigProvider tokens (/src/theme)." },
  { name: "@emotion/styled", message: "antd-only: theme via ConfigProvider tokens (/src/theme)." },
  { name: "@stitches/react", message: "antd-only: theme via ConfigProvider tokens (/src/theme)." },
];

const STYLING_IMPORT_PATTERNS = [
  { group: ["*.module.css", "*.module.scss", "*.module.less"], message: "antd-only: no CSS modules. Use theme tokens + antd's own style props." },
  { group: ["bootstrap", "bootstrap/**", "@mui/**", "@chakra-ui/**", "react-bootstrap"], message: "antd-only: one component library. Compose from Ant Design." },
];

export const presentationRules = [
  // ---------------------------------------------------------------------------
  // 1. No logic in presentation. Data arrives via Props, actions leave via Callbacks.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/no-logic-in-presentation",
    files: PRESENTATION,
    rules: {
      // Declared with the styling bans too — see the note above LOGIC_IMPORT_PATHS.
      "no-restricted-imports": ["error", {
        paths: [...LOGIC_IMPORT_PATHS, ...STYLING_IMPORT_PATHS],
        patterns: [...LOGIC_IMPORT_PATTERNS, ...STYLING_IMPORT_PATTERNS],
      }],
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "No fetch() in presentation." },
        { name: "XMLHttpRequest", message: "No network calls in presentation." },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 2. antd-only. This is the rule the CI step was already claiming to enforce.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/antd-only",
    files: PRESENTATION,
    plugins: { react },
    rules: {
      "react/forbid-elements": ["error", { forbid: HAND_ROLLED }],
      // NOTE: the styling import bans (styled-components, CSS modules, second
      // component libraries) are declared in block 1's no-restricted-imports.
      // Re-declaring the rule here would REPLACE block 1's options and silently
      // kill the no-logic bans.
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Tokens, not hex. tokens.ts is the one place raw colors are allowed.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/tokens-not-hardcoded-colors",
    files: PRESENTATION,
    ignores: ["src/theme/tokens.ts"],
    rules: {
      "no-restricted-syntax": ["error", {
        selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}){1,2}$/]",
        message: "No hardcoded colors. Read from theme.useToken(), or add it to /src/theme/tokens.ts.",
      }],
    },
  },
];

export default presentationRules;
