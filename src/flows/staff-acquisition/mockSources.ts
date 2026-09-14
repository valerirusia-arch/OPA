// src/flows/staff-acquisition/mockSources.ts
//
// Prototype rows for the acquisition sources list. Held in the screen's local
// state so the CRUD actions actually respond; nothing is fetched or persisted.

import type { AcquisitionSource } from "../../features/Acquisition/ui/types";

/** The referral partners a source can be attached to — the same names the
 *  Partners screen will manage. Mock, for the Source form's Select. */
export const mockPartners: string[] = [
  "Northgate Legal",
  "Bright Futures Immigration",
  "Global Mobility Group",
  "USCIS Direct",
];

export const mockSources: AcquisitionSource[] = [
  { id: "s1", name: "Organic search", partner: "USCIS Direct", code: "ORG-SEARCH", status: "active" },
  { id: "s2", name: "Partner referral", partner: "Northgate Legal", code: "NGL-REF", status: "active" },
  { id: "s3", name: "Paid social", partner: "Bright Futures Immigration", code: "SOC-Q1", status: "active" },
  { id: "s4", name: "Community webinar", partner: "Global Mobility Group", code: "WBNR-2026", status: "inactive" },
  { id: "s5", name: "Email newsletter", partner: "USCIS Direct", code: "NEWS-EDM", status: "active" },
];
