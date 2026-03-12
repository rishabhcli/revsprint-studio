import { createDraftBrief } from "./engine.js";

export function createDemoBrief() {
  return createDraftBrief({
    companyName: "Northstar Ledger",
    productName: "RevSprint Studio",
    businessStage: "Early revenue",
    businessModel: "B2B SaaS",
    targetBuyer: "Revenue operations leads at seed to Series A SaaS companies",
    primaryRegion: "North America",
    salesMotion: "Founder-led outbound",
    monthlyRevenueGoal: "25000",
    monthlyBudget: "8000",
    teamSize: "4",
    currentChannels: "Founder outbound, LinkedIn content, warm referrals, operator communities",
    currentSignals:
      "Demos convert well when the founder is present, pilot calls are warm, but follow-up is inconsistent and no repeatable proof story is packaged yet.",
    customerPain:
      "Revenue teams lose time because pipeline reviews, campaign context, and action priorities stay scattered across tools and meetings.",
    differentiators:
      "Faster operating rhythm, a visible weekly sprint, low setup friction, and a cleaner decision layer for lean commercial teams.",
    operatingConstraints:
      "Small team, limited paid budget, founder still runs demos, and no formal partner package exists yet.",
    needsPartners: true,
    enterpriseFocus: true,
  });
}
