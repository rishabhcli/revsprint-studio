import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSprintBrief } from "../app/src/brief.js";
import { createDemoBrief } from "../app/src/demo.js";
import { createAppState } from "../app/src/state.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function mustExist(relativePath) {
  await access(path.join(rootDir, relativePath));
}

const requiredFiles = [
  "app/index.html",
  "app/404.html",
  "app/styles.css",
  "app/src/main.js",
  "app/src/engine.js",
  "app/src/brief.js",
  "app/src/state.js",
  "tests/engine.test.js",
  "tests/brief.test.js",
  "README.md",
  "docs/index.html",
  "docs/404.html",
  "docs/styles.css",
  "docs/manifest.json",
  "docs/src/main.js",
];

for (const file of requiredFiles) {
  await mustExist(file);
}

const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
for (const scriptName of ["dev", "test", "build", "verify"]) {
  assert.ok(packageJson.scripts?.[scriptName], `Missing package script: ${scriptName}`);
}

const readme = await readFile(path.join(rootDir, "README.md"), "utf8");
for (const expectedSnippet of ["RevSprint Studio", "six-week", "npm run build", "npm run verify"]) {
  assert.match(readme, new RegExp(expectedSnippet, "i"), `README is missing "${expectedSnippet}"`);
}

const docsIndex = await readFile(path.join(rootDir, "docs", "index.html"), "utf8");
assert.match(docsIndex, /RevSprint Studio/, "Built docs/index.html does not contain the app shell");
for (const expectedAsset of ["./styles.css", "./manifest.json", "./src/main.js"]) {
  assert.match(
    docsIndex,
    new RegExp(expectedAsset.replaceAll(".", "\\.")),
    `Built docs/index.html is missing ${expectedAsset}`
  );
}

const manifest = JSON.parse(await readFile(path.join(rootDir, "docs", "manifest.json"), "utf8"));
assert.equal(manifest.name, "RevSprint Studio");

const tests = await readdir(path.join(rootDir, "tests"));
assert.ok(tests.length >= 2, "Expected at least two automated test files");

const demoState = createAppState({
  draftBrief: createDemoBrief(),
  baseDate: new Date("2026-03-12T10:00:00-07:00"),
  generatedAt: "2026-03-12T10:00:00-07:00",
});

assert.equal(demoState.sprint.weekPlan.length, 6, "Expected a six-week sprint");
assert.equal(demoState.sprint.workflow.length, 5, "Expected five commercial pods");
assert.ok(demoState.sprint.plays.length >= 5, "Expected ranked commercial plays");
assert.match(
  demoState.sprint.summary.operatingPosture,
  /(trust|motion|focus)/i,
  "Expected an operating posture"
);

const brief = buildSprintBrief(demoState);
assert.match(brief, /RevSprint Brief/, "Sprint brief should be generated");

const builtCss = await readFile(path.join(rootDir, "docs", "styles.css"), "utf8");
assert.match(builtCss, /--font-body/, "Built CSS is missing design tokens");

const builtMain = await readFile(path.join(rootDir, "docs", "src", "main.js"), "utf8");
assert.match(builtMain, /generateButton/, "Built JavaScript is missing interaction wiring");
assert.match(builtMain, /serviceWorker\.register/, "Built JavaScript is missing service worker registration");

console.log("Verification passed");
console.log(`- built docs path: ${path.join(rootDir, "docs")}`);
console.log(`- sprint weeks: ${demoState.sprint.weekPlan.length}`);
console.log(`- ranked plays: ${demoState.sprint.plays.length}`);
console.log(`- static assets verified: index.html, styles.css, manifest.json, src/main.js`);
