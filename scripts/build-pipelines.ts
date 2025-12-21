#!/usr/bin/env bun
/**
 * Build script to compile pipeline TypeScript files to JavaScript
 * for Node.js compatibility when installed via npm
 */

import { glob } from "tinyglobby";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const PIPELINES_DIR = "./pipelines";
const DIST_PIPELINES_DIR = "./dist-pipelines";

async function buildPipelines() {
  console.log("Building pipelines for npm distribution...");

  // Clean dist-pipelines directory
  await fs.rm(DIST_PIPELINES_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_PIPELINES_DIR, { recursive: true });

  // Find all pipeline TypeScript files
  const files = await glob("*.ts", { cwd: PIPELINES_DIR });

  for (const file of files) {
    if (file.startsWith("_") || file.startsWith(".")) continue;

    const inputPath = path.join(PIPELINES_DIR, file);
    const outputPath = path.join(DIST_PIPELINES_DIR, file.replace(".ts", ".js"));

    console.log(`  Compiling: ${file}`);

    // Use Bun to build each pipeline file
    const result = await Bun.build({
      entrypoints: [inputPath],
      outdir: DIST_PIPELINES_DIR,
      target: "node",
      format: "esm",
      naming: "[name].js",
      external: ["*"], // Don't bundle any dependencies
    });

    if (!result.success) {
      console.error(`  Failed to compile ${file}:`);
      for (const log of result.logs) {
        console.error(`    ${log}`);
      }
      process.exit(1);
    }
  }

  console.log(`\nPipelines built successfully to ${DIST_PIPELINES_DIR}/`);
}

buildPipelines().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
