// src/shared/ui/FacetFilters.tsx
//
// The facets a list is filtered by, behind one button, with what is currently
// set shown as chips under the toolbar.
//
// Why one button and not a row of selects: search is the control people reach
// for on every list in the product, so it belongs in the page's own toolbar,
// in the same place every time. Facets are not — each list has a different
// number of them, and lining three up beside the search on one screen and none
// on the next is what makes two tables stop looking alike. Collapsing them
// keeps the toolbar identical everywhere.
//
// What is filtered stays visible without opening anything: the button carries
// a count, and each active facet is a chip you can take off in one click.
//
// It is generic because it was written for the borrower list and the
// application queue needs exactly the same thing. Cloning it would have given
// the two lists one appearance today and two in a month; a list supplies its
// facets and its "everything" value, and nothing else differs.
//
// Dumb: values in, values out.

import {
  Badge, Button, Divider, Flex, Popover, Select, Tag, Typography, theme,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useT } from "./i18n/useT";
import { pill } from "./tag.styles";
import { getStyles, styles } from "./FacetFilters.styles";

/** The "no filter" value every facet starts at. */
export const ALL = "all";

export type Facet<V extends Record<string, string>> = {
  key: keyof V & string;
  label: string;
  options: { value: string; label: string }[];
};

export type FacetFiltersProps<V extends Record<string, string>> = {
  facets: Facet<V>[];
  value: V;
  onChange: (next: V) => void;
  /** What "nothing filtered" looks like, for Clear all. */
  empty: V;
};

export function FacetFilters<V extends Record<string, string>>({
  facets,
  value,
  onChange,
  empty,
}: FacetFiltersProps<V>) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);

  const activeCount = facets.filter((facet) => value[facet.key] !== ALL).length;

  const panel = (
    <Flex vertical gap={16} style={styles.panel}>
      {facets.map((facet) => (
        <Flex vertical key={facet.key}>
          <Typography.Text style={s.label}>{facet.label}</Typography.Text>
          <Select
            value={value[facet.key]}
            onChange={(next) => onChange({ ...value, [facet.key]: next })}
            options={facet.options}
            style={styles.field}
          />
        </Flex>
      ))}

      <Flex vertical>
        <Divider style={s.divider} />
        <Button
          type="link"
          style={s.clear}
          disabled={activeCount === 0}
          onClick={() => onChange(empty)}
        >
          {t("filters.clearAll")}
        </Button>
      </Flex>
    </Flex>
  );

  return (
    <Popover content={panel} trigger="click" placement="bottomRight">
      {/* Brand colour, not antd's default red: this is a count of choices the
          reader made, not something that has gone wrong. */}
      <Badge count={activeCount} size="small" color={token.colorPrimary}>
        <Button icon={<FilterOutlined />} style={s.trigger}>
          {t("filters.title")}
        </Button>
      </Badge>
    </Popover>
  );
}

/**
 * What is currently filtered, in words, directly under the toolbar. Renders
 * nothing at all when no facet is set, so an unfiltered list keeps its layout.
 */
export function FacetFilterChips<V extends Record<string, string>>({
  facets,
  value,
  onChange,
}: Omit<FacetFiltersProps<V>, "empty">) {
  const t = useT();
  const { token } = theme.useToken();
  const s = getStyles(token);
  const active = facets.filter((facet) => value[facet.key] !== ALL);

  if (active.length === 0) return null;

  return (
    <Flex gap={8} wrap style={styles.chips}>
      {active.map((facet) => {
        const option = facet.options.find((item) => item.value === value[facet.key]);
        const text = `${facet.label}: ${option?.label ?? value[facet.key]}`;
        return (
          <Tag
            key={facet.key}
            variant="filled"
            style={{ ...pill, ...s.chip }}
            closable
            closeIcon
            aria-label={t("filters.remove", { name: text })}
            onClose={() => onChange({ ...value, [facet.key]: ALL })}
          >
            {text}
          </Tag>
        );
      })}
    </Flex>
  );
}
