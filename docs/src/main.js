import { copyText, downloadBrief } from "./brief.js";
import { createDemoBrief } from "./demo.js";
import { createDraftBrief, formatMoney } from "./engine.js";
import {
  createAppState,
  draftHasChanges,
  getMetrics,
  hydrateWorkspace,
  regenerateSprint,
  replaceDraftBrief,
  updateDraftField,
} from "./state.js";
import { clearWorkspaceSnapshot, loadWorkspaceSnapshot, saveWorkspaceSnapshot } from "./storage.js";

const elements = {
  companyName: document.querySelector("#companyName"),
  productName: document.querySelector("#productName"),
  businessStage: document.querySelector("#businessStage"),
  businessModel: document.querySelector("#businessModel"),
  targetBuyer: document.querySelector("#targetBuyer"),
  primaryRegion: document.querySelector("#primaryRegion"),
  salesMotion: document.querySelector("#salesMotion"),
  monthlyRevenueGoal: document.querySelector("#monthlyRevenueGoal"),
  monthlyBudget: document.querySelector("#monthlyBudget"),
  teamSize: document.querySelector("#teamSize"),
  currentChannels: document.querySelector("#currentChannels"),
  currentSignals: document.querySelector("#currentSignals"),
  customerPain: document.querySelector("#customerPain"),
  differentiators: document.querySelector("#differentiators"),
  operatingConstraints: document.querySelector("#operatingConstraints"),
  needsPartners: document.querySelector("#needsPartners"),
  enterpriseFocus: document.querySelector("#enterpriseFocus"),
  generateButton: document.querySelector("#generateButton"),
  demoButton: document.querySelector("#demoButton"),
  resetButton: document.querySelector("#resetButton"),
  heroHeadline: document.querySelector("#heroHeadline"),
  heroSubline: document.querySelector("#heroSubline"),
  heroStats: document.querySelector("#heroStats"),
  heroPodStrip: document.querySelector("#heroPodStrip"),
  profileChips: document.querySelector("#profileChips"),
  summaryCards: document.querySelector("#summaryCards"),
  weekPlan: document.querySelector("#weekPlan"),
  milestoneList: document.querySelector("#milestoneList"),
  playGrid: document.querySelector("#playGrid"),
  angleGrid: document.querySelector("#angleGrid"),
  workflowGrid: document.querySelector("#workflowGrid"),
  briefPreview: document.querySelector("#briefPreview"),
  copyBriefButton: document.querySelector("#copyBriefButton"),
  downloadBriefButton: document.querySelector("#downloadBriefButton"),
  statusLine: document.querySelector("#statusLine"),
  toast: document.querySelector("#toast"),
};

let state =
  hydrateWorkspace(loadWorkspaceSnapshot()) ??
  createAppState({
    draftBrief: createDemoBrief(),
    baseDate: new Date(),
  });

let toastTimer = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function persist() {
  saveWorkspaceSnapshot(state);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2200);
}

function syncForm() {
  const { draftBrief } = state;
  elements.companyName.value = draftBrief.companyName;
  elements.productName.value = draftBrief.productName;
  elements.businessStage.value = draftBrief.businessStage;
  elements.businessModel.value = draftBrief.businessModel;
  elements.targetBuyer.value = draftBrief.targetBuyer;
  elements.primaryRegion.value = draftBrief.primaryRegion;
  elements.salesMotion.value = draftBrief.salesMotion;
  elements.monthlyRevenueGoal.value = draftBrief.monthlyRevenueGoal;
  elements.monthlyBudget.value = draftBrief.monthlyBudget;
  elements.teamSize.value = draftBrief.teamSize;
  elements.currentChannels.value = draftBrief.currentChannels;
  elements.currentSignals.value = draftBrief.currentSignals;
  elements.customerPain.value = draftBrief.customerPain;
  elements.differentiators.value = draftBrief.differentiators;
  elements.operatingConstraints.value = draftBrief.operatingConstraints;
  elements.needsPartners.checked = draftBrief.needsPartners;
  elements.enterpriseFocus.checked = draftBrief.enterpriseFocus;
}

function renderHero() {
  const metrics = getMetrics(state);
  const { sprint } = state;

  elements.heroHeadline.textContent = sprint.summary.headline;
  elements.heroSubline.textContent = sprint.summary.subline;
  elements.heroStats.innerHTML = [
    {
      label: "Readiness score",
      value: `${metrics.readinessScore}%`,
      detail: "How complete the current commercial brief is for a disciplined sprint.",
    },
    {
      label: "Ranked plays",
      value: String(metrics.playCount),
      detail: "Commercial bets prioritized against stage, motion, and constraints.",
    },
    {
      label: "Weeks planned",
      value: String(metrics.weeksPlanned),
      detail: "A six-week sprint that keeps the operating rhythm visible.",
    },
    {
      label: "Pods active",
      value: String(metrics.podCount),
      detail: "Commercial pods sharing the same brief and checkpoint logic.",
    },
  ]
    .map(
      (card) => `
        <article class="stat-card">
          <p>${escapeHtml(card.label)}</p>
          <strong>${escapeHtml(card.value)}</strong>
          <span>${escapeHtml(card.detail)}</span>
        </article>
      `
    )
    .join("");

  elements.heroPodStrip.innerHTML = sprint.workflow
    .map((step) => `<span class="agent-pill">${escapeHtml(step.pod)}</span>`)
    .join("");

  elements.profileChips.innerHTML = sprint.summary.profileTags
    .map((tag) => `<span class="profile-chip">${escapeHtml(tag)}</span>`)
    .join("");
}

function renderSummaryCards() {
  const cards = [
    {
      title: "North star",
      value: state.sprint.summary.northStar,
      accent: "north-star",
    },
    {
      title: "Operating posture",
      value: state.sprint.summary.operatingPosture,
      accent: "funding",
    },
    {
      title: "Pipeline signal",
      value: `${state.sprint.summary.pipeline} ${state.sprint.summary.budgetPosture}`,
      accent: "essay",
    },
    {
      title: "Risk watch",
      value: state.sprint.summary.risk,
      accent: "risk",
    },
  ];

  elements.summaryCards.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card summary-${escapeHtml(card.accent)}">
          <p>${escapeHtml(card.title)}</p>
          <strong>${escapeHtml(card.value)}</strong>
        </article>
      `
    )
    .join("");
}

function renderWeekPlan() {
  elements.weekPlan.innerHTML = state.sprint.weekPlan
    .map(
      (week) => `
        <article class="month-card">
          <div class="month-card-top">
            <div>
              <p class="month-kicker">${escapeHtml(week.dateLabel)}</p>
              <h3>${escapeHtml(week.label)}</h3>
            </div>
            <span class="month-agent">${escapeHtml(week.leadPod)}</span>
          </div>
          <p class="month-theme">${escapeHtml(week.theme)}</p>
          <p class="month-focus">${escapeHtml(week.focus)}</p>
          <ul class="month-task-list">
            ${week.tasks
              .map(
                (task) => `
                  <li>
                    <span>${escapeHtml(task.dateLabel)}</span>
                    <strong>${escapeHtml(task.title)}</strong>
                    <small>${escapeHtml(task.pod)}</small>
                  </li>
                `
              )
              .join("")}
          </ul>
          <div class="month-checkpoint">${escapeHtml(week.checkpoint)}</div>
        </article>
      `
    )
    .join("");
}

function renderMilestones() {
  elements.milestoneList.innerHTML = state.sprint.milestones
    .map(
      (milestone) => `
        <article class="milestone-item">
          <div class="milestone-date">${escapeHtml(milestone.dateLabel)}</div>
          <div>
            <strong>${escapeHtml(milestone.title)}</strong>
            <p>${escapeHtml(milestone.week)} · ${escapeHtml(milestone.pod)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPlayGrid() {
  elements.playGrid.innerHTML = state.sprint.plays
    .map(
      (play) => `
        <article class="scholarship-card">
          <div class="scholarship-top">
            <div>
              <p class="kicker">Commercial play</p>
              <h3>${escapeHtml(play.title)}</h3>
            </div>
            <div class="fit-chip">${escapeHtml(play.fitLabel)}</div>
          </div>
          <strong class="award-range">${escapeHtml(play.budgetLabel)}</strong>
          <p class="award-window">${escapeHtml(play.window)}</p>
          <p class="award-summary">${escapeHtml(play.summary)}</p>
          <div class="score-meter" aria-hidden="true">
            <span style="width:${Math.max(18, play.score)}%"></span>
          </div>
          <ul class="reason-list">
            ${play.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderAngles() {
  elements.angleGrid.innerHTML = state.sprint.messagingAngles
    .map(
      (angle) => `
        <article class="essay-card">
          <div class="essay-top">
            <p>${escapeHtml(angle.title)}</p>
            <span>${escapeHtml(angle.pod)}</span>
          </div>
          <strong>${escapeHtml(angle.prompt)}</strong>
        </article>
      `
    )
    .join("");
}

function renderWorkflow() {
  elements.workflowGrid.innerHTML = state.sprint.workflow
    .map(
      (step) => `
        <article class="workflow-card">
          <div class="workflow-step">0${step.step}</div>
          <div>
            <p class="kicker">Pod handoff</p>
            <h3>${escapeHtml(step.pod)}</h3>
            <p class="workflow-role">${escapeHtml(step.role)}</p>
            <p><strong>Input:</strong> ${escapeHtml(step.input)}</p>
            <p><strong>Output:</strong> ${escapeHtml(step.output)}</p>
            <p><strong>Next:</strong> ${escapeHtml(step.handoff)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderBrief() {
  elements.briefPreview.value = state.briefPreview;
}

function renderStatus() {
  if (draftHasChanges(state)) {
    elements.statusLine.textContent =
      "Draft changed. Regenerate to refresh the sprint, ranked plays, and export brief.";
    return;
  }

  const generatedLabel = new Date(state.generatedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  elements.statusLine.textContent = `Sprint current as of ${generatedLabel}. Revenue target: ${formatMoney(
    state.sprint.profile.monthlyRevenueGoal
  )} per month.`;
}

function render(skipFormSync = false) {
  if (!skipFormSync) {
    syncForm();
  }
  renderHero();
  renderSummaryCards();
  renderWeekPlan();
  renderMilestones();
  renderPlayGrid();
  renderAngles();
  renderWorkflow();
  renderBrief();
  renderStatus();
}

function handleFieldChange(field, value) {
  state = updateDraftField(state, field, value);
  persist();
  render(true);
}

function handleCheckboxChange(field, event) {
  handleFieldChange(field, event.target.checked);
}

const textFields = [
  "companyName",
  "productName",
  "businessStage",
  "businessModel",
  "targetBuyer",
  "primaryRegion",
  "salesMotion",
  "monthlyRevenueGoal",
  "monthlyBudget",
  "teamSize",
  "currentChannels",
  "currentSignals",
  "customerPain",
  "differentiators",
  "operatingConstraints",
];

for (const field of textFields) {
  const eventName =
    elements[field].tagName === "SELECT" ? "change" : "input";

  elements[field].addEventListener(eventName, (event) => {
    handleFieldChange(field, event.target.value);
  });
}

elements.needsPartners.addEventListener("change", (event) => {
  handleCheckboxChange("needsPartners", event);
});

elements.enterpriseFocus.addEventListener("change", (event) => {
  handleCheckboxChange("enterpriseFocus", event);
});

elements.generateButton.addEventListener("click", () => {
  state = regenerateSprint(state);
  persist();
  render(true);
  showToast("Sprint regenerated");
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    state = regenerateSprint(state);
    persist();
    render(true);
    showToast("Sprint regenerated");
  }
});

elements.demoButton.addEventListener("click", () => {
  state = replaceDraftBrief(state, createDemoBrief());
  persist();
  render();
  showToast("Demo company loaded");
});

elements.resetButton.addEventListener("click", () => {
  clearWorkspaceSnapshot();
  state = createAppState({
    draftBrief: createDraftBrief(),
    baseDate: new Date(),
  });
  render();
  showToast("Workspace reset");
});

elements.copyBriefButton.addEventListener("click", async () => {
  await copyText(state.briefPreview);
  showToast("Brief copied");
});

elements.downloadBriefButton.addEventListener("click", () => {
  downloadBrief(state.sprint.profile.companyName, state.briefPreview);
  showToast("Brief downloaded");
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  });
}
