import test from "node:test";
import assert from "node:assert/strict";

import { buildSprintBrief } from "../app/src/brief.js";
import { createDemoBrief } from "../app/src/demo.js";
import { createAppState } from "../app/src/state.js";

test("buildSprintBrief exports the company snapshot and ranked plays", () => {
  const state = createAppState({
    draftBrief: createDemoBrief(),
    baseDate: new Date("2026-03-12T10:00:00-07:00"),
    generatedAt: "2026-03-12T10:00:00-07:00",
  });

  const brief = buildSprintBrief(state);

  assert.match(brief, /RevSprint Brief: Northstar Ledger/);
  assert.match(brief, /Partner pilot sprint/);
  assert.match(brief, /Founder-led outbound sequence/);
  assert.match(brief, /Monthly revenue goal: \$25,000/);
  assert.match(brief, /Operating posture:/);
  assert.match(brief, /Six-Week Sprint/);
});
