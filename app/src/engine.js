const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const DEFAULT_DRAFT_BRIEF = {
  companyName: "",
  productName: "",
  businessStage: "Idea",
  businessModel: "B2B SaaS",
  targetBuyer: "",
  primaryRegion: "",
  salesMotion: "Founder-led outbound",
  monthlyRevenueGoal: "",
  monthlyBudget: "",
  teamSize: "",
  currentChannels: "",
  currentSignals: "",
  customerPain: "",
  differentiators: "",
  operatingConstraints: "",
  needsPartners: false,
  enterpriseFocus: false,
};

const POD_TEAM = [
  {
    id: "market",
    pod: "Market Analyst",
    role: "Turns raw commercial notes into a focused buyer and pain narrative.",
    handoff: "ICP Strategist",
  },
  {
    id: "icp",
    pod: "ICP Strategist",
    role: "Sharpens who to target first and which proof points should lead the sprint.",
    handoff: "Demand Planner",
  },
  {
    id: "demand",
    pod: "Demand Planner",
    role: "Selects the first channel plays, cadence, and experiment mix.",
    handoff: "Pipeline Operator",
  },
  {
    id: "pipeline",
    pod: "Pipeline Operator",
    role: "Turns the playbook into a weekly operating rhythm with checkpoints and follow-up loops.",
    handoff: "Story Architect",
  },
  {
    id: "story",
    pod: "Story Architect",
    role: "Packages the offer, proof, and positioning into campaign-ready messaging angles.",
    handoff: "Founders and advisors",
  },
];

const PLAY_CATALOG = [
  {
    id: "partner-pilot",
    title: "Partner pilot sprint",
    summary: "Package one high-trust partner offer and use it to open warmer enterprise conversations faster.",
    window: "Weeks 2 to 4",
    stageTags: ["beta", "early revenue", "growth"],
    motionTags: ["partnership-led", "founder-led outbound", "consultative selling"],
    partnerFriendly: true,
    enterpriseFriendly: true,
    contentFriendly: false,
    keywordBoosts: ["partner", "ecosystem", "referral", "pilot", "implementation"],
  },
  {
    id: "founder-outbound",
    title: "Founder-led outbound sequence",
    summary: "Turn founder context into a tight outbound list, message ladder, and consistent follow-up rhythm.",
    window: "Weeks 1 to 3",
    stageTags: ["idea", "beta", "early revenue"],
    motionTags: ["founder-led outbound", "consultative selling"],
    partnerFriendly: false,
    enterpriseFriendly: true,
    contentFriendly: false,
    keywordBoosts: ["outbound", "demo", "follow-up", "pipeline", "meeting"],
  },
  {
    id: "proof-loop",
    title: "Customer proof loop",
    summary: "Convert early customer feedback into proof snippets, objections coverage, and a stronger close path.",
    window: "Weeks 1 to 4",
    stageTags: ["beta", "early revenue", "growth"],
    motionTags: ["founder-led outbound", "product-led growth", "consultative selling"],
    partnerFriendly: false,
    enterpriseFriendly: true,
    contentFriendly: true,
    keywordBoosts: ["proof", "testimonial", "case study", "pilot", "customer"],
  },
  {
    id: "content-engine",
    title: "Proof-driven content engine",
    summary: "Ship one repeatable insight format that turns product learning into top-of-funnel awareness and demand.",
    window: "Weeks 2 to 6",
    stageTags: ["beta", "early revenue", "growth"],
    motionTags: ["product-led growth", "founder-led outbound", "partnership-led"],
    partnerFriendly: false,
    enterpriseFriendly: false,
    contentFriendly: true,
    keywordBoosts: ["content", "linkedin", "community", "thought leadership", "webinar"],
  },
  {
    id: "plg-activation",
    title: "Product activation sprint",
    summary: "Reduce friction from signup to first value so the product itself helps convert interest into traction.",
    window: "Weeks 1 to 5",
    stageTags: ["beta", "early revenue", "growth"],
    motionTags: ["product-led growth"],
    partnerFriendly: false,
    enterpriseFriendly: false,
    contentFriendly: false,
    keywordBoosts: ["self-serve", "activation", "trial", "onboarding", "adoption"],
  },
  {
    id: "consultative-workshop",
    title: "Consultative workshop offer",
    summary: "Wrap the offer in a short working session that helps buyers feel the value before a full purchase decision.",
    window: "Weeks 2 to 5",
    stageTags: ["idea", "beta", "early revenue"],
    motionTags: ["consultative selling", "services", "founder-led outbound"],
    partnerFriendly: true,
    enterpriseFriendly: true,
    contentFriendly: false,
    keywordBoosts: ["workshop", "consulting", "advisory", "service", "discovery"],
  },
  {
    id: "referral-loop",
    title: "Advisor and referral loop",
    summary: "Create a structured ask for warm introductions and revive dormant relationships with a clearer offer.",
    window: "Weeks 1 to 4",
    stageTags: ["idea", "beta", "early revenue"],
    motionTags: ["founder-led outbound", "partnership-led", "consultative selling"],
    partnerFriendly: true,
    enterpriseFriendly: false,
    contentFriendly: false,
    keywordBoosts: ["referral", "advisor", "network", "warm", "community"],
  },
];

function addDays(date, count) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count);
}

function clampNumber(value, min, max, fallback) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, numericValue));
}

function sentenceCase(value, fallback) {
  const normalized = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return normalized || fallback;
}

function splitList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function includesAny(source, keywords) {
  return keywords.some((keyword) => source.includes(keyword));
}

function listToText(items, fallback) {
  if (!items.length) {
    return fallback;
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function formatMoney(value) {
  return CURRENCY_FORMATTER.format(value);
}

function getFitLabel(score) {
  if (score >= 88) {
    return "High fit";
  }
  if (score >= 76) {
    return "Strong fit";
  }
  if (score >= 64) {
    return "Solid fit";
  }
  return "Exploratory";
}

function buildThemeFlags(profile) {
  const textStack = [
    profile.businessModel,
    profile.targetBuyer,
    profile.salesMotion,
    profile.currentChannels.join(" "),
    profile.currentSignals,
    profile.customerPain,
    profile.differentiators,
    profile.operatingConstraints,
  ]
    .join(" ")
    .toLowerCase();

  return {
    outbound: includesAny(textStack, ["outbound", "demo", "follow-up", "meeting", "prospect"]),
    content: includesAny(textStack, ["content", "linkedin", "webinar", "newsletter", "community"]),
    partner: includesAny(textStack, ["partner", "ecosystem", "referral", "implementation"]),
    plg: includesAny(textStack, ["product-led", "self-serve", "trial", "onboarding", "activation"]),
    consultative: includesAny(textStack, ["consultative", "workshop", "advisory", "service", "discovery"]),
    analytics: includesAny(textStack, ["ops", "analytics", "reporting", "pipeline", "forecast"]),
    fintech: includesAny(textStack, ["fintech", "finance", "compliance", "ledger", "payments"]),
    enterprise: profile.enterpriseFocus || includesAny(textStack, ["enterprise", "multi-team", "procurement"]),
  };
}

function getReadinessScore(profile) {
  let score = 44;

  if (profile.companyName) score += 4;
  if (profile.productName) score += 4;
  if (profile.targetBuyer.length >= 1) score += 10;
  if (profile.currentChannels.length >= 2) score += 8;
  if (profile.currentSignals.length >= 40) score += 9;
  if (profile.customerPain.length >= 30) score += 8;
  if (profile.differentiators.length >= 30) score += 7;
  if (profile.operatingConstraints.length >= 20) score += 6;
  if (profile.monthlyRevenueGoal >= 15000) score += 5;
  if (profile.teamSize >= 3) score += 4;
  if (profile.enterpriseFocus) score += 3;
  if (profile.needsPartners) score += 2;

  return Math.min(score, 97);
}

function getNextMilestoneDate(baseDate, weekNumber) {
  return SHORT_DATE_FORMATTER.format(addDays(baseDate, weekNumber * 7 - 2));
}

function buildStageHeadline(profile) {
  if (profile.businessStage === "Idea") {
    return "Package the offer before spreading effort across too many channels.";
  }
  if (profile.businessStage === "Beta") {
    return "Move from interesting signals to a tighter repeatable motion.";
  }
  if (profile.businessStage === "Growth") {
    return "Use the sprint to tighten execution and prove where to scale next.";
  }
  return "You have enough traction to turn scattered signals into a disciplined commercial sprint.";
}

export function createDraftBrief(overrides = {}) {
  return {
    ...DEFAULT_DRAFT_BRIEF,
    ...overrides,
  };
}

export function normalizeBrief(input) {
  const brief = createDraftBrief(input);

  return {
    companyName: sentenceCase(brief.companyName, "Untitled company"),
    productName: sentenceCase(brief.productName, "Core product"),
    businessStage: sentenceCase(brief.businessStage, "Idea"),
    businessModel: sentenceCase(brief.businessModel, "B2B SaaS"),
    targetBuyer: splitList(brief.targetBuyer),
    primaryRegion: sentenceCase(brief.primaryRegion, "Global"),
    salesMotion: sentenceCase(brief.salesMotion, "Founder-led outbound"),
    monthlyRevenueGoal: clampNumber(brief.monthlyRevenueGoal, 1000, 250000, 15000),
    monthlyBudget: clampNumber(brief.monthlyBudget, 500, 100000, 5000),
    teamSize: clampNumber(brief.teamSize, 1, 50, 3),
    currentChannels: splitList(brief.currentChannels),
    currentSignals: sentenceCase(brief.currentSignals, "Commercial context is still emerging."),
    customerPain: sentenceCase(brief.customerPain, "The buyer pain still needs sharper language."),
    differentiators: sentenceCase(brief.differentiators, "Differentiation is still being clarified."),
    operatingConstraints: sentenceCase(brief.operatingConstraints, "Team capacity is constrained."),
    needsPartners: Boolean(brief.needsPartners),
    enterpriseFocus: Boolean(brief.enterpriseFocus),
  };
}

function scorePlay(profile, flags, play) {
  let score = 54;
  const lowerText = [
    profile.currentSignals,
    profile.customerPain,
    profile.differentiators,
    profile.operatingConstraints,
    profile.currentChannels.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (play.stageTags.includes(profile.businessStage.toLowerCase())) score += 10;
  if (play.motionTags.map((tag) => tag.toLowerCase()).includes(profile.salesMotion.toLowerCase())) score += 11;
  if (profile.needsPartners && play.partnerFriendly) score += 8;
  if (profile.enterpriseFocus && play.enterpriseFriendly) score += 8;
  if (flags.content && play.contentFriendly) score += 6;
  if (flags.outbound && play.id === "founder-outbound") score += 7;
  if (flags.partner && play.partnerFriendly) score += 7;
  if (flags.plg && play.id === "plg-activation") score += 8;
  if (flags.consultative && play.id === "consultative-workshop") score += 9;

  for (const keyword of play.keywordBoosts) {
    if (lowerText.includes(keyword)) {
      score += 3;
    }
  }

  if (profile.monthlyBudget >= 7000 && play.id !== "referral-loop") {
    score += 2;
  }

  return Math.min(score, 98);
}

function buildPlayReasons(profile, flags, play) {
  const reasons = [];

  if (play.motionTags.map((tag) => tag.toLowerCase()).includes(profile.salesMotion.toLowerCase())) {
    reasons.push(`Fits the current motion: ${profile.salesMotion}.`);
  }
  if (profile.enterpriseFocus && play.enterpriseFriendly) {
    reasons.push("Supports a more enterprise-style buying motion.");
  }
  if (profile.needsPartners && play.partnerFriendly) {
    reasons.push("Creates a stronger path for partner-assisted distribution.");
  }
  if (flags.content && play.contentFriendly) {
    reasons.push("Matches the current interest in proof-led content or community channels.");
  }

  reasons.push(`Best run during ${play.window.toLowerCase()}.`);
  return reasons.slice(0, 4);
}

function buildTopPlays(profile, flags) {
  return PLAY_CATALOG.map((play) => {
    const score = scorePlay(profile, flags, play);
    return {
      id: play.id,
      title: play.title,
      summary: play.summary,
      score,
      fitLabel: getFitLabel(score),
      budgetLabel:
        profile.monthlyBudget >= 7000 ? "Fits current budget" : "Requires tight scope control",
      window: play.window,
      reasons: buildPlayReasons(profile, flags, play),
    };
  })
    .sort((left, right) => right.score - left.score)
    .slice(0, 6);
}

function buildWeekTasks(profile, plays, weekNumber, baseDate) {
  const leadPlay = plays[0];
  const secondaryPlay = plays[1];
  const buyerLabel = listToText(profile.targetBuyer.slice(0, 2), "the first target buyer");

  const templates = [
    {
      theme: "Sharpen the first commercial promise",
      focus: `Clarify the buyer problem, package the offer, and choose one lead play for ${buyerLabel}.`,
      checkpoint: `Commit the primary sprint bet around ${leadPlay.title.toLowerCase()}.`,
      tasks: [
        `Condense the buyer problem into one crisp commercial narrative for ${buyerLabel}.`,
        `Rewrite the homepage or deck headline around the clearest differentiator.`,
        `Lock the week-one scorecard for meetings, replies, and next-step rate.`,
      ],
    },
    {
      theme: "Package proof and motion",
      focus: `Turn raw wins and objections into reusable proof that supports ${leadPlay.title.toLowerCase()}.`,
      checkpoint: `Publish one proof asset that sales and content can both reuse.`,
      tasks: [
        `Collect three customer or pilot proof snippets from calls and notes.`,
        `Write the objection-reply ladder that sales can reuse this week.`,
        `Refine the offer so the first call leads naturally into a second-step commitment.`,
      ],
    },
    {
      theme: "Launch the primary play",
      focus: `Run the first full execution cycle for ${leadPlay.title.toLowerCase()} and track where friction appears.`,
      checkpoint: `Complete the first full send, meeting, or partner outreach cycle.`,
      tasks: [
        `Ship the first full execution pass for ${leadPlay.title.toLowerCase()}.`,
        `Track where replies slow down, where meetings stall, and where proof lands.`,
        `Create the next-step template used after every positive signal.`,
      ],
    },
    {
      theme: "Open the secondary path",
      focus: `Use ${secondaryPlay.title.toLowerCase()} to widen the funnel without breaking team focus.`,
      checkpoint: `Validate whether the secondary path deserves a permanent slot in the operating rhythm.`,
      tasks: [
        `Launch a tightly scoped version of ${secondaryPlay.title.toLowerCase()}.`,
        `Compare quality of signal against the primary play, not just volume.`,
        `Decide what should stay manual and what can become a repeatable process.`,
      ],
    },
    {
      theme: "Tighten follow-through",
      focus: `Improve follow-up, qualification, and conversion consistency before adding more surface area.`,
      checkpoint: `Shorten the gap between interest and a committed next step.`,
      tasks: [
        `Audit open conversations and move every live lead to a clear next state.`,
        `Write one follow-up cadence that the whole commercial team can actually run.`,
        `Capture the strongest call snippets and repeat them in messaging.`,
      ],
    },
    {
      theme: "Review, keep, and double down",
      focus: "Turn the sprint into a repeatable operating loop and decide what to scale next.",
      checkpoint: "Choose the next 30-day bet based on signal quality, proof strength, and team capacity.",
      tasks: [
        `Review what created the strongest commercial movement across the full sprint.`,
        `Cut one low-signal activity and reinvest time into the best-performing play.`,
        `Package the final brief for advisors, operators, or the next planning cycle.`,
      ],
    },
  ];

  const plan = templates[weekNumber - 1];
  const weekStart = addDays(baseDate, (weekNumber - 1) * 7);

  return {
    id: `week-${weekNumber}`,
    label: `Week ${weekNumber}`,
    dateLabel: `${LONG_DATE_FORMATTER.format(weekStart)}`,
    leadPod: POD_TEAM[Math.min(weekNumber - 1, POD_TEAM.length - 1)].pod,
    theme: plan.theme,
    focus: plan.focus,
    checkpoint: plan.checkpoint,
    tasks: plan.tasks.map((title, index) => ({
      id: `week-${weekNumber}-task-${index + 1}`,
      title,
      dateLabel: SHORT_DATE_FORMATTER.format(addDays(weekStart, index * 2)),
      pod: POD_TEAM[(weekNumber + index - 1) % POD_TEAM.length].pod,
    })),
  };
}

function buildMilestones(weekPlan, baseDate) {
  return weekPlan.map((week, index) => ({
    id: `milestone-${index + 1}`,
    title: week.checkpoint,
    week: week.label,
    pod: week.leadPod,
    dateLabel: getNextMilestoneDate(baseDate, index + 1),
  }));
}

function buildMessagingAngles(profile, plays) {
  const buyerLabel = listToText(profile.targetBuyer.slice(0, 2), "the first buyer");

  return [
    {
      id: "angle-clarity",
      title: "From scattered motion to one weekly operating rhythm",
      prompt: `Lead with the promise that ${profile.productName} helps ${buyerLabel} choose what to do next without adding more tooling overhead.`,
      pod: "Story Architect",
    },
    {
      id: "angle-proof",
      title: "Proof over hype",
      prompt: `Position the offer around real commercial visibility: clearer pipeline movement, tighter follow-up, and faster decision cycles.`,
      pod: "Market Analyst",
    },
    {
      id: "angle-constraint",
      title: "Built for lean teams",
      prompt: `Show how the product respects small-team limits, especially when budget and founder time are both tight.`,
      pod: "Demand Planner",
    },
    {
      id: "angle-next-step",
      title: "A better next-step system",
      prompt: `Make the message about reducing dropped follow-through and turning warm signals into scheduled next actions.`,
      pod: "Pipeline Operator",
    },
  ];
}

function buildWorkflow(profile, plays) {
  return POD_TEAM.map((pod, index) => ({
    step: index + 1,
    pod: pod.pod,
    role: pod.role,
    input:
      index === 0
        ? `${profile.companyName} brief and current commercial notes`
        : `${POD_TEAM[index - 1].pod} output`,
    output:
      index === 0
        ? "Buyer problem frame"
        : index === 1
          ? `Primary motion around ${plays[0].title.toLowerCase()}`
          : index === 2
            ? "Sprint-ready channel plan"
            : index === 3
              ? "Weekly operating checkpoints"
              : "Messaging and proof package",
    handoff: pod.handoff,
  }));
}

export function generateSprintPlan(draftBrief, options = {}) {
  const profile = normalizeBrief(draftBrief);
  const baseDate = options.baseDate ? new Date(options.baseDate) : new Date();
  const flags = buildThemeFlags(profile);
  const plays = buildTopPlays(profile, flags);
  const weekPlan = Array.from({ length: 6 }, (_, index) =>
    buildWeekTasks(profile, plays, index + 1, baseDate)
  );
  const milestones = buildMilestones(weekPlan, baseDate);
  const messagingAngles = buildMessagingAngles(profile, plays);
  const workflow = buildWorkflow(profile, plays);
  const readinessScore = getReadinessScore(profile);
  const topBuyer = listToText(profile.targetBuyer.slice(0, 2), "the first buyer");
  const nextMilestone = milestones[0];

  return {
    profile,
    summary: {
      headline: buildStageHeadline(profile),
      subline: `Lead with ${plays[0].title.toLowerCase()} for ${topBuyer}, then use the sprint to tighten proof and follow-through.`,
      northStar: `Reach ${formatMoney(profile.monthlyRevenueGoal)} in monthly revenue with a motion the ${profile.teamSize}-person team can actually sustain.`,
      pipeline: `${plays[0].title} is the lead bet, with ${plays[1].title.toLowerCase()} as the supporting motion.`,
      messageSignal: `Package ${profile.productName} as the faster path from signal to next step for ${topBuyer}.`,
      risk: profile.operatingConstraints,
      nextMilestone: nextMilestone.title,
      nextMilestoneDate: nextMilestone.dateLabel,
      readinessScore,
      profileTags: [
        profile.businessStage,
        profile.salesMotion,
        profile.businessModel,
        profile.primaryRegion,
        profile.enterpriseFocus ? "Enterprise focus" : "Lean team focus",
      ],
    },
    weekPlan,
    milestones,
    plays,
    messagingAngles,
    workflow,
  };
}

export { formatMoney };
