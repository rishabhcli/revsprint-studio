import { formatMoney } from "./engine.js";

function buildList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildSprintBrief(state) {
  const { generatedBrief: brief, sprint } = state;
  const topPlays = sprint.plays.slice(0, 3);

  return [
    `# RevSprint Brief: ${brief.companyName}`,
    "",
    "## Company Snapshot",
    `- Product: ${brief.productName}`,
    `- Stage: ${brief.businessStage}`,
    `- Model: ${brief.businessModel}`,
    `- Target buyer: ${brief.targetBuyer.join(", ")}`,
    `- Region: ${brief.primaryRegion}`,
    `- Sales motion: ${brief.salesMotion}`,
    `- Monthly revenue goal: ${formatMoney(brief.monthlyRevenueGoal)}`,
    `- Monthly GTM budget: ${formatMoney(brief.monthlyBudget)}`,
    `- Team size: ${brief.teamSize}`,
    "",
    "## Operating Readout",
    `- Headline: ${sprint.summary.headline}`,
    `- North star: ${sprint.summary.northStar}`,
    `- Operating posture: ${sprint.summary.operatingPosture}`,
    `- Budget posture: ${sprint.summary.budgetPosture}`,
    `- Primary pipeline signal: ${sprint.summary.pipeline}`,
    `- Message signal: ${sprint.summary.messageSignal}`,
    `- Risk watch: ${sprint.summary.risk}`,
    `- Next milestone: ${sprint.summary.nextMilestone} (${sprint.summary.nextMilestoneDate})`,
    "",
    "## Six-Week Sprint",
    ...sprint.weekPlan.flatMap((week) => [
      `- ${week.label}: ${week.theme}`,
      `  - Lead pod: ${week.leadPod}`,
      `  - Focus: ${week.focus}`,
      `  - Checkpoint: ${week.checkpoint}`,
    ]),
    "",
    "## Ranked Channel Plays",
    ...topPlays.map(
      (play) =>
        `- ${play.title} (${play.fitLabel}, ${play.window}, ${play.budgetLabel})`
    ),
    "",
    "## Messaging Angles",
    ...sprint.messagingAngles.map(
      (angle) => `- ${angle.title}: ${angle.prompt}`
    ),
    "",
    "## Commercial Pod Workflow",
    ...sprint.workflow.map(
      (step) => `- Step ${step.step}: ${step.pod} -> ${step.output} -> ${step.handoff}`
    ),
    "",
    "## Immediate Next 14 Days",
    buildList(sprint.weekPlan.slice(0, 2).map((week) => week.checkpoint)),
  ].join("\n");
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
  return true;
}

export function downloadBrief(companyName, briefText) {
  const slug = companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const blob = new Blob([briefText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug || "revsprint"}-brief.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
