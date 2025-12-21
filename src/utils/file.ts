import { ConfigurationError } from "@utils/errors.ts";
import { validateFull } from "@schema/validator.ts";
import type { PipelineConfig } from "@typings/pipeline.ts";
import type { PipelineResult } from "@typings/result.ts";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "tinyglobby";

const LOCAL_PIPELINES_DIR = "./pipelines";
const OUTPUTS_DIR = "./outputs";

// Runtime detection
const isBun = typeof globalThis.Bun !== "undefined";

// Get the package root directory (where compiled pipelines are installed)
function getPackagePipelinesDir(): string {
  // Use import.meta.url which gives the actual file location at runtime
  // fileURLToPath handles both file:// URLs and works cross-platform
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  // After bundling, code is in dist/, so go up one level to package root, then into dist-pipelines
  // (dist-pipelines contains compiled .js versions of the pipelines)
  return path.resolve(currentDir, "../dist-pipelines");
}

// Get local pipelines directory (in current working directory)
function getLocalPipelinesDir(): string {
  return path.resolve(process.cwd(), "pipelines");
}

// Cross-runtime file operations
export async function writeFile(filePath: string, content: string): Promise<void> {
  if (isBun) {
    await Bun.write(filePath, content);
  } else {
    await fs.writeFile(filePath, content, "utf-8");
  }
}

export async function readFile(filePath: string): Promise<string> {
  if (isBun) {
    const file = Bun.file(filePath);
    return await file.text();
  } else {
    return await fs.readFile(filePath, "utf-8");
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  if (isBun) {
    const file = Bun.file(filePath);
    return await file.exists();
  } else {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

function resolvePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(process.cwd(), filePath);
}

export async function loadPipeline(pipelineIdOrPath: string): Promise<PipelineConfig> {
  // If it's a full path, use it directly
  if (pipelineIdOrPath.includes("/") || pipelineIdOrPath.endsWith(".ts")) {
    const resolvedPath = resolvePath(pipelineIdOrPath);
    try {
      const module = await import(resolvedPath);
      const config = module.default || module;
      return validateFull(config);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Cannot find module")) {
        throw new ConfigurationError(`Pipeline not found: ${pipelineIdOrPath}`);
      }
      throw error;
    }
  }

  // It's just a pipeline ID - check local first, then package
  // Local pipelines are .ts files, package pipelines are compiled .js files
  const localPath = path.join(getLocalPipelinesDir(), `${pipelineIdOrPath}.ts`);
  const packagePath = path.join(getPackagePipelinesDir(), `${pipelineIdOrPath}.js`);

  // Try local pipelines first
  if (await fileExists(localPath)) {
    try {
      const module = await import(localPath);
      const config = module.default || module;
      return validateFull(config);
    } catch (error) {
      if (!(error instanceof Error && error.message.includes("Cannot find module"))) {
        throw error;
      }
    }
  }

  // Try package pipelines
  if (await fileExists(packagePath)) {
    try {
      const module = await import(packagePath);
      const config = module.default || module;
      return validateFull(config);
    } catch (error) {
      if (!(error instanceof Error && error.message.includes("Cannot find module"))) {
        throw error;
      }
    }
  }

  throw new ConfigurationError(`Pipeline not found: ${pipelineIdOrPath}. Checked: ${localPath}, ${packagePath}`);
}

export async function listPipelines(): Promise<{ id: string; name: string; version: string; description?: string; stages: number; source: "local" | "package" }[]> {
  const pipelines: { id: string; name: string; version: string; description?: string; stages: number; source: "local" | "package" }[] = [];
  const seenIds = new Set<string>();

  // Helper to load pipelines from a directory
  async function loadFromDir(dir: string, source: "local" | "package") {
    try {
      // Local pipelines are .ts files, package pipelines are compiled .js files
      const pattern = source === "package" ? "*.js" : "*.ts";
      const files = await glob(pattern, { cwd: dir });

      for (const file of files) {
        if (file.startsWith("_") || file.startsWith(".")) continue;

        try {
          const filePath = path.join(dir, file);
          const module = await import(filePath);
          const config = module.default || module;

          if (config?.pipeline?.id && !seenIds.has(config.pipeline.id)) {
            seenIds.add(config.pipeline.id);
            pipelines.push({
              id: config.pipeline.id,
              name: config.pipeline.name,
              version: config.pipeline.version,
              description: config.pipeline.description,
              stages: config.stages?.length || 0,
              source,
            });
          }
        } catch {
          // Skip invalid pipeline files
        }
      }
    } catch {
      // Directory doesn't exist or is empty
    }
  }

  // Check local pipelines first (they take priority)
  await loadFromDir(getLocalPipelinesDir(), "local");

  // Then check package pipelines
  await loadFromDir(getPackagePipelinesDir(), "package");

  return pipelines;
}

export async function savePipelineResult(result: PipelineResult, outputDir?: string): Promise<string> {
  const dir = outputDir || OUTPUTS_DIR;
  const timestamp = formatTimestamp(result.timestamp);
  const filename = `result-${result.pipelineId}-${timestamp}.json`;
  const filePath = `${dir}/${filename}`;

  await ensureDir(dir);
  await writeFile(filePath, JSON.stringify(result, null, 2));

  return filePath;
}

export async function saveOptimizedPrompt(
  result: PipelineResult,
  originalPrompt: string,
  optimizedPrompt: string,
  outputDir?: string
): Promise<string> {
  const dir = outputDir || OUTPUTS_DIR;
  const timestamp = formatTimestamp(result.timestamp);
  const filename = `prompt-${result.pipelineId}-${timestamp}.md`;
  const filePath = `${dir}/${filename}`;

  const content = `# Optimized Prompt

**Pipeline:** ${result.pipelineId}
**Generated:** ${result.timestamp.toISOString()}
**Original Length:** ${originalPrompt.length} chars
**Optimized Length:** ${optimizedPrompt.length} chars
**Total Cost:** $${result.summary.totalCost.toFixed(4)}
**Duration:** ${(result.summary.totalDuration / 1000).toFixed(1)}s

---

## Original Prompt

> ${originalPrompt.replace(/\n/g, "\n> ")}

---

## Optimized Prompt

${optimizedPrompt}

---

## Stage Summary

| Stage | Duration | Cost | Status |
|-------|----------|------|--------|
${result.stages
  .map(
    (s) =>
      `| ${s.stageName} | ${(s.duration / 1000).toFixed(1)}s | $${s.cost.toFixed(4)} | ${s.status} |`
  )
  .join("\n")}
`;

  await ensureDir(dir);
  await writeFile(filePath, content);

  return filePath;
}

export async function readInputFile(filePath: string): Promise<string> {
  if (!(await fileExists(filePath))) {
    throw new ConfigurationError(`Input file not found: ${filePath}`);
  }

  return await readFile(filePath);
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory may already exist
  }
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

export async function pipelineExists(pipelineId: string): Promise<boolean> {
  // Local pipelines are .ts files, package pipelines are compiled .js files
  const localPath = path.join(getLocalPipelinesDir(), `${pipelineId}.ts`);
  const packagePath = path.join(getPackagePipelinesDir(), `${pipelineId}.js`);
  return await fileExists(localPath) || await fileExists(packagePath);
}
