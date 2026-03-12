import test from "node:test";
import assert from "node:assert/strict";

import { createDemoBrief } from "../app/src/demo.js";
import { generateSprintPlan } from "../app/src/engine.js";

test("generateSprintPlan creates a stable six-week sprint for the demo company", () => {
  const sprint = generateSprintPlan(createDemoBrief(), {
    baseDate: new Date("2026-03-12T10:00:00-07:00"),
  });

  assert.equal(sprint.weekPlan.length, 6);
  assert.equal(sprint.plays[0].title, "Partner pilot sprint");
  assert.equal(sprint.plays[1].title, "Founder-led outbound sequence");
  assert.equal(sprint.summary.nextMilestoneDate, "Mar 17");
  assert.equal(sprint.workflow.length, 5);
});

test("generateSprintPlan includes messaging angles and checkpoints", () => {
  const sprint = generateSprintPlan(createDemoBrief(), {
    baseDate: new Date("2026-03-12T10:00:00-07:00"),
  });

  assert.equal(sprint.messagingAngles.length, 4);
  assert.match(sprint.weekPlan[0].checkpoint, /primary sprint bet/i);
  assert.match(sprint.summary.pipeline, /partner pilot sprint/i);
  assert.match(sprint.summary.operatingPosture, /higher-trust opportunities/i);
  assert.match(sprint.summary.budgetPosture, /supports one primary play/i);
  assert.ok(sprint.summary.readinessScore >= 80);
});
