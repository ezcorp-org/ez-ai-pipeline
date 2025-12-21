import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { executionManager, type WebSocketData } from "./execution.ts";

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

const server = Bun.serve<WebSocketData>({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url);
    const path = url.pathname;

    // WebSocket upgrade for /ws
    if (path === "/ws") {
      const upgraded = server.upgrade(req, {
        data: {
          subscribedExecutions: new Set<string>(),
        },
      });
      if (upgraded) {
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    // API routes

    // Config status - check if API key is present
    if (path === "/api/config/status") {
      return Response.json({
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        // Never expose the actual key
      });
    }

    if (path === "/api/pipelines") {
      const pipelines = await getPipelines();
      return Response.json(pipelines);
    }

    // POST /api/pipelines/:id/run - Run a pipeline
    if (req.method === "POST" && path.match(/^\/api\/pipelines\/[^/]+\/run$/)) {
      const id = path.split("/")[3];
      const pipeline = await getPipeline(id);
      if (!pipeline) {
        return Response.json({ error: "Pipeline not found" }, { status: 404 });
      }

      try {
        const body = await req.json();
        const input = body?.input;

        if (!input || typeof input !== "string" || input.trim() === "") {
          return Response.json(
            { error: "Input is required and must be a non-empty string" },
            { status: 400 }
          );
        }

        const executionId = executionManager.generateExecutionId();

        // Start execution asynchronously (don't await)
        executionManager.start(executionId, pipeline, input.trim());

        return Response.json({
          executionId,
          pipelineId: pipeline.pipeline.id,
          status: "started",
        });
      } catch (e) {
        return Response.json(
          { error: e instanceof Error ? e.message : "Failed to start execution" },
          { status: 500 }
        );
      }
    }

    // GET /api/pipelines/:id - Get pipeline details
    if (path.startsWith("/api/pipelines/")) {
      const id = path.replace("/api/pipelines/", "");
      const pipeline = await getPipeline(id);
      if (!pipeline) {
        return Response.json({ error: "Pipeline not found" }, { status: 404 });
      }
      return Response.json(pipeline);
    }

    // POST /api/executions/:id/cancel - Cancel a running execution
    if (req.method === "POST" && path.match(/^\/api\/executions\/[^/]+\/cancel$/)) {
      const executionId = path.split("/")[3];
      const cancelled = executionManager.cancel(executionId);
      return Response.json({ cancelled });
    }

    // GET /api/executions/:id - Get execution status
    if (path.match(/^\/api\/executions\/[^/]+$/)) {
      const executionId = path.split("/")[3];
      const execution = executionManager.getExecution(executionId);
      if (!execution) {
        return Response.json({ error: "Execution not found" }, { status: 404 });
      }
      return Response.json({
        id: execution.id,
        pipelineId: execution.pipelineId,
        status: execution.status,
        startTime: execution.startTime,
        result: execution.result ? {
          status: execution.result.status,
          pipelineId: execution.result.pipelineId,
          summary: execution.result.summary,
          output: execution.result.output,
          error: execution.result.error,
        } : undefined,
      });
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
  websocket: {
    open(ws) {
      // Connection opened, data is already initialized with subscribedExecutions
    },
    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "subscribe" && data.executionId) {
          const success = executionManager.subscribe(data.executionId, ws);
          ws.send(JSON.stringify({
            type: "subscribed",
            executionId: data.executionId,
            success,
          }));
        }

        if (data.type === "unsubscribe" && data.executionId) {
          executionManager.unsubscribe(data.executionId, ws);
          ws.send(JSON.stringify({
            type: "unsubscribed",
            executionId: data.executionId,
          }));
        }
      } catch (e) {
        ws.send(JSON.stringify({
          type: "error",
          message: "Invalid message format",
        }));
      }
    },
    close(ws) {
      // Clean up all subscriptions when client disconnects
      executionManager.unsubscribeAll(ws);
    },
  },
});

console.log(`🚀 Pipeline Viewer running at http://localhost:${server.port}`);
