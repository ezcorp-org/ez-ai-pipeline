import { ConfigurationError } from "@utils/errors.ts";
import { validateFull } from "@schema/validator.ts";
import type { PipelineConfig } from "@typings/pipeline.ts";
import type { PipelineResult } from "@typings/result.ts";

const PIPELINES_DIR = "./pipelines";
const OUTPUTS_DIR = "./outputs";

export async function loadPipeline(pipelineIdOrPath: string): Promise<PipelineConfig> {
  let filePath: string;

  // Check if it's a path or an ID
  if (pipelineIdOrPath.includes("/") || pipelineIdOrPath.endsWith(".ts")) {
    filePath = pipelineIdOrPath;
  } else {
    filePath = `${PIPELINES_DIR}/${pipelineIdOrPath}.ts`;
  }

  try {
    const module = await import(Bun.resolveSync(filePath, process.cwd()));
    const config = module.default || module;
    return validateFull(config);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      throw new ConfigurationError(`Pipeline not found: ${filePath}`);
    }
    throw error;
  }
}

export async function listPipelines(): Promise<{ id: string; name: string; version: string; description?: string; stages: number }[]> {
  const pipelines: { id: string; name: string; version: string; description?: string; stages: number }[] = [];

  try {
    const glob = new Bun.Glob("*.ts");
    const files = glob.scanSync({ cwd: PIPELINES_DIR });

    for (const file of files) {
      if (file.startsWith("_") || file.startsWith(".")) continue;

      try {
        const filePath = `${PIPELINES_DIR}/${file}`;
        const module = await import(Bun.resolveSync(filePath, process.cwd()));
        const config = module.default || module;

        if (config?.pipeline?.id) {
          pipelines.push({
            id: config.pipeline.id,
            name: config.pipeline.name,
            version: config.pipeline.version,
            description: config.pipeline.description,
            stages: config.stages?.length || 0,
          });
        }
      } catch {
        // Skip invalid pipeline files
      }
    }
  } catch {
    // Pipelines directory doesn't exist or is empty
  }

  return pipelines;
}

export async function savePipelineResult(result: PipelineResult, outputDir?: string): Promise<string> {
  const dir = outputDir || OUTPUTS_DIR;
  const timestamp = formatTimestamp(result.timestamp);
  const filename = `result-${result.pipelineId}-${timestamp}.json`;
  const filePath = `${dir}/${filename}`;

  await ensureDir(dir);
  await Bun.write(filePath, JSON.stringify(result, null, 2));

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
  await Bun.write(filePath, content);

  return filePath;
}

export async function readInputFile(filePath: string): Promise<string> {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    throw new ConfigurationError(`Input file not found: ${filePath}`);
  }

  return await file.text();
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await Bun.$`mkdir -p ${dir}`.quiet();
  } catch {
    // Directory may already exist
  }
}

function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

export async function pipelineExists(pipelineId: string): Promise<boolean> {
  const filePath = `${PIPELINES_DIR}/${pipelineId}.ts`;
  const file = Bun.file(filePath);
  return await file.exists();
}
