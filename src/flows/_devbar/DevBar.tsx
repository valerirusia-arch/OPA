// src/flows/_devbar/DevBar.tsx
//
// Designer's dev-only nav bar (think: WordPress admin bar).
//
// Renders ONLY in development. `import.meta.env.DEV` is statically replaced at
// build time, so the prod branch collapses to `return null` and DevBarPanel —
// along with everything it imports — is tree-shaken out of production bundles.
//
// Note the two-component split: the DEV check has to sit in a component with NO
// hooks, otherwise it's a conditional early-return above useState/useToken and
// react-hooks flags it (correctly).
//
// It reads src/flows/routes.tsx (plain data — no loaders/guards) and builds a
// jump-to-any-screen switcher. Nothing here fetches, stores, or guards.

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Button, Flex, Segmented, Select, Space, Tag, Tooltip, theme } from "antd";
import {
  AppstoreOutlined, BgColorsOutlined, BookOutlined, EyeInvisibleOutlined,
  MailOutlined, NodeIndexOutlined, ThunderboltOutlined,
} from "@ant-design/icons";
import { flattenRoutes, groupByFlow, resolvePath } from "./flatten";
import { StageDock } from "./StageDock";
import {
  setViewerRole,
  useViewerRole,
  VIEWER_ROLES,
  type ViewerRole,
} from "../../shared/ui/viewerRole";
import {
  CARD_SKINS,
  CARD_SKIN_LABELS,
  setCardSkin,
  useCardSkin,
  type CardSkin,
} from "../../shared/ui/cardSkin";
import {
  getStyles, hiddenToggle, barInner, tagFlush, selectStyle, spacer,
} from "./DevBar.styles";

// Where Storybook runs locally (see the `dev` script in package.json).
const STORYBOOK_URL = "http://localhost:6006";

/** Wording for the "view as" switch. Dev-tool copy, so it is not translated. */
const VIEWER_ROLE_LABELS: Record<ViewerRole, string> = {
  borrower: "Borrower",
  coBorrower: "Co-borrower",
  admin: "Admin",
  underwriter: "Underwriter",
  staff: "OPA staff",
};

/**
 * The three parts of the product, and where each persona starts.
 *
 * Switching between two OFFICE roles must leave you where you are — comparing
 * an Admin's users list with an Underwriter's is the whole point, and jumping
 * away would destroy it. But a Borrower has no users list to compare, and a
 * Co-borrower's application is a different route from the Borrower's, so
 * crossing between areas has to move you somewhere that exists.
 */
const AREA_HOME = {
  staff: "/staff/borrowers",
  borrower: "/application",
  coBorrower: "/co-application",
} as const;

type Area = keyof typeof AREA_HOME;

const areaOfRole = (role: ViewerRole): Area =>
  role === "borrower" || role === "coBorrower" ? role : "staff";

const areaOfPath = (path: string): Area =>
  path.startsWith("/staff")
    ? "staff"
    : path.startsWith("/co-application")
      ? "coBorrower"
      : "borrower";
const FLOWMAP_URL = `${STORYBOOK_URL}/?path=/story/system-flow-map--all-flows`;
/** The email templates have no screen of their own, so this is the way in. */
const EMAILS_URL = `${STORYBOOK_URL}/?path=/story/system-email-designs--all-emails`;

type Props = {
  /** Optional: wire to ThemeProvider so designers can check tokens in both modes. */
  isDark?: boolean;
  onToggleTheme?: () => void;
};

/** Dev gate only. No hooks in here — that's the whole point of the split. */
export function DevBar(props: Props) {
  if (!import.meta.env.DEV) return null;
  return <DevBarPanel {...props} />;
}

function DevBarPanel({ isDark, onToggleTheme }: Props) {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const viewerRole = useViewerRole();
  /**
   * The stage controls belong to the CUSTOMER-SIDE PAGES, not to a role.
   *
   * They were gated on "View as", which meant standing on /loan as the
   * Underwriter — a perfectly normal thing to do while reviewing the design —
   * left no way to walk the stages at all. What the stage changes is the
   * borrower's application, loan and payments pages; where those are is a
   * question about the path.
   */
  const isBorrowerView = areaOfPath(pathname) !== "staff";
  /**
   * The card finish switch shows where a card face is, and nowhere else: the
   * loan page draws the virtual card and the payments page the repayment
   * one. It goes away with the losing skin. See shared/ui/cardSkin.ts.
   */
  const cardSkin = useCardSkin();
  const showCardSkin = pathname.startsWith("/loan") || pathname.startsWith("/payments");
  const [hidden, setHidden] = useState(false);

  const all = useMemo(() => flattenRoutes(), []);

  /*
    EVERY SCREEN, GROUPED BY FLOW — no role filter on the list any more.

    The bar used to carry TWO role controls: a segmented filter over this list
    on the left, and a "View as" select that changed who the app renders as on
    the right. Two controls, one word, different jobs — *"ეს რათ ვინდოდა
    როლები აქ, ხომ უკვე გვქონდა"*. The segmented one is now the real switch
    (below), and the list simply shows everything: it is searchable and
    grouped, which is what made the filter a convenience rather than a need.
  */
  const options = useMemo(
    () =>
      groupByFlow(all).map(([flow, items]) => ({
        label: flow,
        options: items.map((r) => ({ label: `${r.label}  ·  ${r.path}`, value: r.path })),
      })),
    [all]
  );

  /** Switching role can mean switching area; see AREA_HOME. */
  const switchRole = (value: ViewerRole) => {
    setViewerRole(value);
    if (areaOfRole(value) !== areaOfPath(pathname)) {
      // Dynamic route tree => `to` is not literal-typed.
      navigate({ to: AREA_HOME[areaOfRole(value)] });
    }
  };

  /* The dock stays when the bar is hidden: hiding the bar is for LOOKING at
     the design, and this is how you get to the state you want to look at. */
  const dock = isBorrowerView ? <StageDock pathname={pathname} /> : null;

  if (hidden) {
    return (
      <>
        {dock}
        <Button
          size="small"
          icon={<ThunderboltOutlined />}
          onClick={() => setHidden(false)}
          style={hiddenToggle}
        >
          Dev
        </Button>
      </>
    );
  }

  return (
    <>
      <div style={styles.bar}>
        <Flex align="center" justify="space-between" style={barInner} gap={12}>
          <Space size="small" align="center">
            <Tag color="processing" style={tagFlush}>DEV</Tag>

            {/* THE role control, and the only one on the bar: it renders the
                app as this person. See the note above `options`. */}
            <Tooltip title="Preview the app as this person. Borrower / Co-borrower are two situations one account can be in, not two account types.">
              <Segmented<ViewerRole>
                size="small"
                value={viewerRole}
                onChange={switchRole}
                options={VIEWER_ROLES.map((r) => ({
                  label: VIEWER_ROLE_LABELS[r],
                  value: r,
                }))}
              />
            </Tooltip>

            <Select
              size="small"
              showSearch
              style={selectStyle}
              placeholder="Jump to screen…"
              value={undefined}
              options={options}
              notFoundContent="No screens yet — add one to src/flows/routes.tsx"
              filterOption={(input, opt) =>
                String(opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              onChange={(path: string) => {
                const match = all.find((r) => r.path === path);
                // Dynamic route tree => `to` is not literal-typed. Intentional.
                navigate({ to: resolvePath(path, match?.samples) });
              }}
              suffixIcon={<AppstoreOutlined />}
            />

            <Tag style={styles.pathTag}>{pathname}</Tag>

            {/* Two candidate finishes for the card face, so the choice is
                made by looking at the card rather than at two hex values. */}
            {showCardSkin && (
              <Tooltip title="Card face: the deep blue, or the designer's pale #90D5FF with dark ink.">
                <Segmented<CardSkin>
                  size="small"
                  value={cardSkin}
                  onChange={setCardSkin}
                  options={CARD_SKINS.map((k) => ({ label: CARD_SKIN_LABELS[k], value: k }))}
                />
              </Tooltip>
            )}
          </Space>

          <Space size="small">
            <Tooltip title="Flow map — how all screens connect">
              <Button size="small" icon={<NodeIndexOutlined />} href={FLOWMAP_URL} target="_blank">
                Flow map
              </Button>
            </Tooltip>
            <Tooltip title="Email designs — every template, both languages">
              <Button size="small" icon={<MailOutlined />} href={EMAILS_URL} target="_blank">
                Emails
              </Button>
            </Tooltip>
            <Tooltip title="Storybook — components & every screen state">
              <Button size="small" icon={<BookOutlined />} href={STORYBOOK_URL} target="_blank">
                Storybook
              </Button>
            </Tooltip>
            {onToggleTheme && (
              <Tooltip title={`Switch to ${isDark ? "light" : "dark"} theme`}>
                <Button size="small" icon={<BgColorsOutlined />} onClick={onToggleTheme} />
              </Tooltip>
            )}
            <Tooltip title="Hide bar">
              <Button size="small" icon={<EyeInvisibleOutlined />} onClick={() => setHidden(true)} />
            </Tooltip>
          </Space>
        </Flex>
      </div>
      {/* Spacer so the bar never covers the app's own header. */}
      <div style={spacer} />
      {dock}
    </>
  );
}

export default DevBar;
