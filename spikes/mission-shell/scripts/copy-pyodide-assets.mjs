import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const EXPECTED_PYODIDE_VERSION = "314.0.6";
const RUNTIME_ASSETS = Object.freeze([
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
]);

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourceRoot = path.resolve(projectRoot, "node_modules", "pyodide");
const publicRoot = path.resolve(projectRoot, "public");
const targetRoot = path.resolve(publicRoot, "pyodide");
const workerSource = path.resolve(projectRoot, "src", "execution", "pyodide.worker.ts");
const workerTargetRoot = path.resolve(publicRoot, "workers");
const workerTarget = path.resolve(workerTargetRoot, "pyodide.worker.mjs");

function assertInside(parent, candidate, label) {
  const relative = path.relative(parent, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${label} resolved outside ${parent}.`);
  }
}

assertInside(publicRoot, targetRoot, "Pyodide asset target");
assertInside(publicRoot, workerTarget, "Pyodide worker target");

const packageManifest = JSON.parse(
  await readFile(path.join(sourceRoot, "package.json"), "utf8"),
);
if (packageManifest.version !== EXPECTED_PYODIDE_VERSION) {
  throw new Error(
    `Installed Pyodide is ${String(packageManifest.version)}; expected ${EXPECTED_PYODIDE_VERSION}.`,
  );
}

await mkdir(targetRoot, { recursive: true });
await mkdir(workerTargetRoot, { recursive: true });

let totalBytes = 0;
for (const asset of RUNTIME_ASSETS) {
  const source = path.resolve(sourceRoot, asset);
  const target = path.resolve(targetRoot, asset);
  assertInside(sourceRoot, source, `Pyodide source ${asset}`);
  assertInside(targetRoot, target, `Pyodide target ${asset}`);

  const sourceStat = await stat(source);
  if (!sourceStat.isFile()) {
    throw new Error(`Required Pyodide asset is not a file: ${source}`);
  }

  await copyFile(source, target);
  totalBytes += sourceStat.size;
  console.log(`${asset}: ${sourceStat.size} bytes`);
}

console.log(
  `Copied Pyodide ${EXPECTED_PYODIDE_VERSION}: ${totalBytes} bytes across ${RUNTIME_ASSETS.length} same-origin assets.`,
);

await build({
  entryPoints: [workerSource],
  outfile: workerTarget,
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  minify: true,
  legalComments: "none",
  logLevel: "silent",
});

const workerStat = await stat(workerTarget);
console.log(
  `Built native module worker: ${path.relative(projectRoot, workerTarget)} (${workerStat.size} bytes).`,
);
