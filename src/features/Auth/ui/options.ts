// src/features/Auth/ui/options.ts
//
// Reference data for the registration form, as MOCK options.
//
// WBS notes both lists are curated server-side: some countries are excluded,
// and only the US states OPA is licensed to lend in are offered. The shapes
// below are what the screen renders; Dev swaps the source during integration.
//
// Country and preference labels follow the interface language, so they come
// from hooks. State names are official proper nouns and stay as they are.

import { useMemo } from "react";
import type { TranslationKey } from "../../../shared/ui/i18n/dictionary";
import { useT } from "../../../shared/ui/i18n/useT";

const countries: { value: string; key: TranslationKey }[] = [
  { value: "mx", key: "country.mx" },
  { value: "gt", key: "country.gt" },
  { value: "hn", key: "country.hn" },
  { value: "sv", key: "country.sv" },
  { value: "co", key: "country.co" },
  { value: "ve", key: "country.ve" },
  { value: "ph", key: "country.ph" },
  { value: "in", key: "country.in" },
  { value: "ng", key: "country.ng" },
  { value: "ua", key: "country.ua" },
];

export function useCountryOptions() {
  const t = useT();
  return useMemo(
    () => countries.map(({ value, key }) => ({ value, label: t(key) })),
    [t]
  );
}

/** WBS: "select communication preferences (SMS/email)" — the two it names. */
const communication: { value: string; key: TranslationKey }[] = [
  { value: "email", key: "communication.email" },
  { value: "sms", key: "communication.sms" },
];

export function useCommunicationOptions() {
  const t = useT();
  return useMemo(
    () => communication.map(({ value, key }) => ({ value, label: t(key) })),
    [t]
  );
}

/** Supported states only — not all 50. */
export const stateOptions = [
  { value: "AZ", label: "Arizona" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "IL", label: "Illinois" },
  { value: "NC", label: "North Carolina" },
  { value: "NV", label: "Nevada" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
];
