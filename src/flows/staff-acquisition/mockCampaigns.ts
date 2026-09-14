// src/flows/staff-acquisition/mockCampaigns.ts

import type { Campaign } from "../../features/Acquisition/ui/types";

export const mockCampaigns: Campaign[] = [
  { id: "c1", name: "Spring green-card push", source: "Paid social", period: ["2026-03-01", "2026-05-31"], status: "active" },
  { id: "c2", name: "USCIS fee-change awareness", source: "Email newsletter", period: ["2026-01-15", "2026-04-15"], status: "active" },
  { id: "c3", name: "Community webinar series", source: "Community webinar", period: ["2026-02-01", "2026-02-28"], status: "inactive" },
  { id: "c4", name: "Adjustment-of-status season", source: "Organic search", period: ["2026-04-01", "2026-09-30"], status: "active" },
];
