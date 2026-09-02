#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { gzipSync } from "node:zlib";

const DEFAULT_OUTPUT = "artifacts/measurements/bundle-report.json";

function parseArgs(argv) {
  const outputIndex = argv.indexOf("--output");
  if (argv.includes("--help")) {
    process.stdout.write(
      "Usage: node scripts/bundle-report.mjs [--output <path>]\nRun after `npm run build`.\n",
    );
    process.exit(0);
  }
  return {
    output: outputIndex >= 0 && argv[outputIndex + 1] ? argv[outputIndex + 1] : DEFAULT_OUTPUT,
  };
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  if (!(await exists(directory))) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : [target];
    }),
  );
  return files.flat();
}

function portable(relativePath) {
  return relativePath.split(path.sep).join("/");
}

async function describeFile(file, root, includeGzip) {
  const contents = await readFile(file);
  return {
    path: portable(path.relative(root, file)),
    bytes: contents.byteLength,
    ...(includeGzip ? { gzipBytes: gzipSync(contents, { level: 9 }).byteLength } : {}),
    sha256: createHash("sha256").update(contents).digest("hex"),
    contentHashedFilename: /[.-][a-f0-9]{8,}[.-]/i.test(path.basename(file)),
  };
}

function totals(files) {
  return {
    count: files.length,
    bytes: files.reduce((sum, file) => sum + file.bytes, 0),
    ...(files.some((file) => "gzipBytes" in file)
      ? { gzipBytes: files.reduce((sum, file) => sum + (file.gzipBytes ?? 0), 0) }
      : {}),
  };
}

async function readJsonIfPresent(file) {
  if (!(await exists(file))) return null;
  return JSON.parse(await readFile(file, "utf8"));
}

function flattenManifestFiles(manifest) {
  if (!manifest || typeof manifest !== "object") return [];
  const files = new Set();

  function visit(value) {
    if (typeof value === "string" && /\.(?:js|css)$/.test(value)) files.add(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  }

  visit(manifest);
  return [...files].sort();
}

async function findPyodideRoots(publicDirectory) {
  const files = await walk(publicDirectory);
  const markers = files.filter((file) => /(?:^|[\\/])pyodide\.(?:m?js|wasm)$/i.test(file));
  return [...new Set(markers.map((file) => path.dirname(file)))];
}

async function dependencyLedger(packageLockPath) {
  const lock = JSON.parse(await readFile(packageLockPath, "utf8"));
  const rootPackage = lock.packages?.[""] ?? {};
  const direct = {
    ...(rootPackage.dependencies ?? {}),
    ...(rootPackage.devDependencies ?? {}),
  };

  return Object.entries(direct)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, requested]) => {
      const metadata = lock.packages?.[`node_modules/${name}`] ?? {};
      return {
        name,
        requested,
        resolvedVersion: metadata.version ?? null,
        license: metadata.license ?? "UNKNOWN_REQUIRES_REVIEW",
        developmentOnly: Boolean(rootPackage.devDependencies?.[name]),
        resolved: metadata.resolved ?? null,
        integrityRecorded: typeof metadata.integrity === "string",
      };
    });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const projectRoot = process.cwd();
  const nextDirectory = path.join(projectRoot, ".next");
  const chunksDirectory = path.join(nextDirectory, "static", "chunks");
  const publicDirectory = path.join(projectRoot, "public");

  const chunkPaths = (await walk(chunksDirectory)).filter((file) => /\.(?:js|css)$/.test(file));
  const chunks = await Promise.all(chunkPaths.map((file) => describeFile(file, projectRoot, true)));
  chunks.sort((left, right) => right.bytes - left.bytes);

  const pyodideRoots = await findPyodideRoots(publicDirectory);
  const pyodidePaths = [...new Set((await Promise.all(pyodideRoots.map(walk))).flat())];
  const pyodideAssets = await Promise.all(
    pyodidePaths.map((file) => describeFile(file, projectRoot, false)),
  );
  pyodideAssets.sort((left, right) => right.bytes - left.bytes);

  const buildManifest = await readJsonIfPresent(path.join(nextDirectory, "build-manifest.json"));
  const appBuildManifest = await readJsonIfPresent(path.join(nextDirectory, "app-build-manifest.json"));
  const ledger = await dependencyLedger(path.join(projectRoot, "package-lock.json"));

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    projectRoot,
    buildStatus: (await exists(nextDirectory)) ? "build-found" : "not-built",
    nextChunks: {
      totals: totals(chunks),
      files: chunks,
      manifestFiles: {
        build: flattenManifestFiles(buildManifest),
        app: flattenManifestFiles(appBuildManifest),
      },
      caveat:
        "Raw and gzip sizes are transfer proxies. Runtime parse/evaluation cost and shared route attribution need browser traces.",
    },
    copiedPyodideAssets: {
      status: pyodideRoots.length ? "found" : "not-found",
      roots: pyodideRoots.map((directory) => portable(path.relative(projectRoot, directory))),
      totals: totals(pyodideAssets),
      files: pyodideAssets,
      cachingReview: pyodideAssets.length
        ? "Inspect deployed Cache-Control headers separately. Copied stable filenames are not proof of immutable caching."
        : "Run `npm run runtime:assets` or `npm run build`, then rerun this report.",
    },
    directDependencyLedger: {
      source: "package-lock.json root dependency declarations and matching direct package metadata",
      entries: ledger,
      reviewNote:
        "SPDX values are package metadata, not legal advice. UNKNOWN entries and notice/source obligations require owner review.",
    },
  };

  await mkdir(path.dirname(options.output), { recursive: true });
  await writeFile(options.output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (report.buildStatus === "not-built") process.exitCode = 2;
  else if (report.copiedPyodideAssets.status === "not-found") process.exitCode = 3;
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({ status: "failed", error: error instanceof Error ? error.message : String(error) }, null, 2)}\n`,
  );
  process.exitCode = 1;
});
