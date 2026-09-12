// src/features/Borrowers/ui/BorrowerFilters.tsx
//
// The facets the WBS gives the borrower list — state, application status, and
// the DO NOT LOAN marker.
//
// The control itself is shared/ui/FacetFilters, which the application queue
// uses too. All that lives here is WHICH facets this list has: the borrower
// list and the queue must look identical, and the only way to guarantee that
// is for them to be the same component.
//
// Dumb: values in, values out.

import { useT } from "../../../shared/ui/i18n/useT";
import {
  ALL,
  FacetFilterChips,
  FacetFilters,
  type Facet,
} from "../../../shared/ui/FacetFilters";
import { stateOptions } from "../../Auth/ui/options";
import { emptyBorrowerFilters, type BorrowerFilterValues } from "./types";

/** One description of the facets, so the panel and the chips cannot drift. */
function useFacets(): Facet<BorrowerFilterValues>[] {
  const t = useT();
  return [
    {
      key: "state",
      label: t("borrowers.filterState"),
      options: [{ value: ALL, label: t("borrowers.allStates") }, ...stateOptions],
    },
    {
      key: "status",
      label: t("borrowers.filterStatus"),
      options: [
        { value: ALL, label: t("borrowers.allStatuses") },
        { value: "none", label: t("application.none") },
        { value: "submitted", label: t("application.submitted") },
        { value: "review", label: t("application.review") },
        { value: "coBorrower", label: t("application.coBorrower") },
        { value: "approved", label: t("application.approved") },
        { value: "declined", label: t("application.declined") },
      ],
    },
    {
      key: "flag",
      label: t("borrowers.filterFlag"),
      options: [
        { value: ALL, label: t("borrowers.allFlags") },
        { value: "flagged", label: t("borrowers.flagOnly") },
        { value: "clear", label: t("borrowers.flagNone") },
      ],
    },
  ];
}

export type BorrowerFiltersProps = {
  value: BorrowerFilterValues;
  onChange: (next: BorrowerFilterValues) => void;
};

export function BorrowerFilters({ value, onChange }: BorrowerFiltersProps) {
  return (
    <FacetFilters
      facets={useFacets()}
      value={value}
      onChange={onChange}
      empty={emptyBorrowerFilters}
    />
  );
}

export function BorrowerFilterChips({ value, onChange }: BorrowerFiltersProps) {
  return <FacetFilterChips facets={useFacets()} value={value} onChange={onChange} />;
}
