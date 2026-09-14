// src/flows/staff-acquisition/mockPartners.ts
//
// Prototype rows for the referral partners and partner groups lists.

import type { PartnerGroup, ReferralPartner } from "../../features/Acquisition/ui/types";

export const mockGroups: PartnerGroup[] = [
  { id: "g1", name: "Legal referrers", code: "LEGAL", status: "active" },
  { id: "g2", name: "Digital partners", code: "DIGITAL", status: "active" },
  { id: "g3", name: "Community orgs", code: "COMMUNITY", status: "inactive" },
];

export const mockReferralPartners: ReferralPartner[] = [
  { id: "p1", name: "Northgate Legal", group: "Legal referrers", status: "active" },
  { id: "p2", name: "Bright Futures Immigration", group: "Community orgs", status: "active" },
  { id: "p3", name: "Global Mobility Group", group: "Digital partners", status: "active" },
  { id: "p4", name: "USCIS Direct", group: "Digital partners", status: "inactive" },
];
