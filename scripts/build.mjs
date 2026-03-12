import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "app");
const outDir = path.join(rootDir, "docs");
const demoDir = path.join(outDir, "demo");
const preservedDemoDir = path.join(rootDir, ".tmp", "build-preserve-demo");

await rm(preservedDemoDir, { recursive: true, force: true });
try {
  await cp(demoDir, preservedDemoDir, { recursive: true });
} catch {}
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(sourceDir, outDir, { recursive: true });
try {
  await mkdir(demoDir, { recursive: true });
  await cp(preservedDemoDir, demoDir, { recursive: true });
} catch {}
await writeFile(path.join(outDir, ".nojekyll"), "", "utf8");
await rm(preservedDemoDir, { recursive: true, force: true });

console.log(`Built RevSprint Studio to ${path.relative(rootDir, outDir)}`);
