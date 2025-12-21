import { readdir } from "node:fs/promises";
import { join } from "node:path";

const PIPELINES_DIR = join(import.meta.dir, "../pipelines");
const OUTPUTS_DIR = join(import.meta.dir, "../outputs");
const DIST_DIR = join(import.meta.dir, "dist");

// Helper to get pipeline list
async function getPipelines() {
  const files = await readdir(PIPELINES_DIR);
  const pipelines = [];

  for (const file of files) {
    if (file.endsWith(".ts")) {
      try {
        const mod = await import(join(PIPELINES_DIR, file));
        const config = mod.default;
        pipelines.push({
          filename: file,
          id: config.pipeline.id,
          name: config.pipeline.name,
          version: config.pipeline.version,
          description: config.pipeline.description,
          stageCount: config.stages.length,
          defaultProvider: config.pipeline.defaultProvider,
        });
      } catch (e) {
        console.error(`Failed to load pipeline ${file}:`, e);
      }
    }
  }

  return pipelines;
}

// Helper to get single pipeline
async function getPipeline(id: string) {
  const files = await readdir(PIPELINES_DIR);

  for (const file of files) {
    if (file.endsWith(".ts")) {
      try {
        const mod = await import(join(PIPELINES_DIR, file));
        const config = mod.default;
        if (config.pipeline.id === id || file === `${id}.ts`) {
          return config;
        }
      } catch (e) {
        console.error(`Failed to load pipeline ${file}:`, e);
      }
    }
  }

  return null;
}

// Helper to get outputs list
async function getOutputs() {
  const files = await readdir(OUTPUTS_DIR);
  const outputs = [];

  for (const file of files) {
    if (file.startsWith("result-") && file.endsWith(".json")) {
      try {
        const content = await Bun.file(join(OUTPUTS_DIR, file)).json();
        outputs.push({
          filename: file,
          pipelineId: content.pipelineId,
          status: content.status,
          timestamp: content.timestamp,
          duration: content.summary?.totalDuration,
          cost: content.summary?.totalCost,
          stagesRun: content.summary?.stagesRun,
          stagesSkipped: content.summary?.stagesSkipped,
          stagesFailed: content.summary?.stagesFailed,
        });
      } catch (e) {
        console.error(`Failed to load output ${file}:`, e);
      }
    }
  }

  // Sort by timestamp descending
  outputs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return outputs;
}

// Helper to get single output
async function getOutput(filename: string) {
  try {
    const content = await Bun.file(join(OUTPUTS_DIR, filename)).json();
    return content;
  } catch (e) {
    return null;
  }
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Serve static files from dist
async function serveStatic(path: string): Promise<Response | null> {
  const file = Bun.file(join(DIST_DIR, path));
  if (await file.exists()) {
    return new Response(file);
  }
  return null;
}

// Serve index.html for SPA routes
async function serveIndex(): Promise<Response> {
  return new Response(Bun.file(join(DIST_DIR, "index.html")), {
    headers: { "Content-Type": "text/html" },
  });
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // API routes
    if (path === "/api/pipelines") {
      const pipelines = await getPipelines();
      return Response.json(pipelines);
    }

    if (path.startsWith("/api/pipelines/")) {
      const id = path.replace("/api/pipelines/", "");
      const pipeline = await getPipeline(id);
      if (!pipeline) {
        return Response.json({ error: "Pipeline not found" }, { status: 404 });
      }
      return Response.json(pipeline);
    }

    if (path === "/api/outputs") {
      const outputs = await getOutputs();
      return Response.json(outputs);
    }

    if (path.startsWith("/api/outputs/")) {
      const filename = path.replace("/api/outputs/", "");
      const output = await getOutput(filename);
      if (!output) {
        return Response.json({ error: "Output not found" }, { status: 404 });
      }
      return Response.json(output);
    }

    // Static files
    if (path.endsWith(".js") || path.endsWith(".css") || path.endsWith(".map")) {
      const staticResponse = await serveStatic(path);
      if (staticResponse) return staticResponse;
    }

    // Styles subdirectory
    if (path.startsWith("/styles/")) {
      const staticResponse = await serveStatic(path);
      if (staticResponse) return staticResponse;
    }

    // SPA fallback - serve index.html for all other routes
    return serveIndex();
  },
});

console.log(`🚀 Pipeline Viewer running at http://localhost:${server.port}`);
