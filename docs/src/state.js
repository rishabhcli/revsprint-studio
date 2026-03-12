import { buildSprintBrief } from "./brief.js";
import { createDraftBrief, generateSprintPlan, normalizeBrief } from "./engine.js";

function finalizeState(state) {
  const generatedBrief = normalizeBrief(state.generatedBrief ?? state.draftBrief);
  const sprint = generateSprintPlan(generatedBrief, {
    baseDate: state.baseDate,
  });

  return {
    ...state,
    generatedBrief,
    sprint,
    briefPreview: buildSprintBrief({
      ...state,
      generatedBrief,
      sprint,
    }),
  };
}

export function createAppState({
  draftBrief = createDraftBrief(),
  baseDate = new Date(),
  generatedAt = new Date().toISOString(),
} = {}) {
  const normalizedDraft = createDraftBrief(draftBrief);
  return finalizeState({
    draftBrief: normalizedDraft,
    generatedBrief: normalizedDraft,
    baseDate: new Date(baseDate).toISOString(),
    generatedAt,
  });
}

export function updateDraftField(state, field, value) {
  return {
    ...state,
    draftBrief: {
      ...state.draftBrief,
      [field]: value,
    },
  };
}

export function regenerateSprint(state, generatedAt = new Date().toISOString()) {
  return finalizeState({
    ...state,
    generatedBrief: createDraftBrief(state.draftBrief),
    generatedAt,
  });
}

export function replaceDraftBrief(state, draftBrief, generatedAt = new Date().toISOString()) {
  return finalizeState({
    ...state,
    draftBrief: createDraftBrief(draftBrief),
    generatedBrief: createDraftBrief(draftBrief),
    generatedAt,
  });
}

export function getMetrics(state) {
  return {
    readinessScore: state.sprint.summary.readinessScore,
    playCount: state.sprint.plays.length,
    weeksPlanned: state.sprint.weekPlan.length,
    podCount: state.sprint.workflow.length,
  };
}

export function draftHasChanges(state) {
  return JSON.stringify(state.draftBrief) !== JSON.stringify(state.generatedBrief);
}

export function hydrateWorkspace(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const requiredFields = ["draftBrief", "generatedBrief", "baseDate", "generatedAt"];
  if (!requiredFields.every((field) => field in candidate)) {
    return null;
  }

  return finalizeState({
    draftBrief: createDraftBrief(candidate.draftBrief),
    generatedBrief: createDraftBrief(candidate.generatedBrief),
    baseDate: candidate.baseDate,
    generatedAt: candidate.generatedAt,
  });
}
