import type { ArgumentsCamelCase } from "yargs";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import chalk from "chalk";

export interface WebOptions {
  port?: number;
}

// Runtime detection
const isBun = typeof globalThis.Bun !== "undefined";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(filePath: string): Promise<unknown> {
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

async function readDir(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
}

// Get package root (where the CLI is installed)
function getPackageRoot(): string {
  // When running from dist/index.js, go up one level
  return path.resolve(import.meta.dirname || __dirname, "..");
}

export async function webCommand(args: ArgumentsCamelCase<WebOptions>): Promise<void> {
  const port = args.port || 3000;
  const packageRoot = getPackageRoot();

  // Determine directories
  const pipelinesDir = path.join(process.cwd(), "pipelines");
  const outputsDir = path.join(process.cwd(), "outputs");
  const webDistDir = path.join(packageRoot, "web-dist");

  // Check if web-dist exists
  if (!(await fileExists(webDistDir))) {
    console.log(chalk.red("Error: Web assets not found."));
    console.log(chalk.dim(`Expected at: ${webDistDir}`));
    process.exit(1);
  }

  // Helper functions
  async function getPipelines() {
    const files = await readDir(pipelinesDir);
    const pipelines = [];

    for (const file of files) {
      if (file.endsWith(".ts") && !file.startsWith("_")) {
        try {
          const fullPath = path.resolve(pipelinesDir, file);
          const mod = await import(fullPath);
          const config = mod.default;
          if (config?.pipeline) {
            pipelines.push({
              filename: file,
              id: config.pipeline.id,
              name: config.pipeline.name,
              version: config.pipeline.version,
              description: config.pipeline.description,
              stageCount: config.stages?.length || 0,
              defaultProvider: config.pipeline.defaultProvider,
            });
          }
        } catch (e) {
          // Skip invalid files
        }
      }
    }

    return pipelines;
  }

  async function getPipeline(id: string) {
    const files = await readDir(pipelinesDir);

    for (const file of files) {
      if (file.endsWith(".ts")) {
        try {
          const fullPath = path.resolve(pipelinesDir, file);
          const mod = await import(fullPath);
          const config = mod.default;
          if (config?.pipeline?.id === id || file === `${id}.ts`) {
            return config;
          }
        } catch {
          // Skip
        }
      }
    }

    return null;
  }

  async function getOutputs() {
    const files = await readDir(outputsDir);
    const outputs = [];

    for (const file of files) {
      if (file.startsWith("result-") && file.endsWith(".json")) {
        try {
          const content = await readJsonFile(path.join(outputsDir, file)) as Record<string, unknown>;
          const summary = content.summary as Record<string, unknown> | undefined;
          outputs.push({
            filename: file,
            pipelineId: content.pipelineId,
            status: content.status,
            timestamp: content.timestamp,
            duration: summary?.totalDuration,
            cost: summary?.totalCost,
            stagesRun: summary?.stagesRun,
            stagesSkipped: summary?.stagesSkipped,
            stagesFailed: summary?.stagesFailed,
          });
        } catch {
          // Skip invalid files
        }
      }
    }

    outputs.sort(
      (a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime()
    );

    return outputs;
  }

  async function getOutput(filename: string) {
    try {
      return await readJsonFile(path.join(outputsDir, filename));
    } catch {
      return null;
    }
  }

  // Start server based on runtime
  if (isBun) {
    // Use Bun.serve for better performance
    const server = Bun.serve({
      port,
      async fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;

        // API routes
        if (pathname === "/api/pipelines") {
          return Response.json(await getPipelines());
        }

        if (pathname.startsWith("/api/pipelines/")) {
          const id = pathname.replace("/api/pipelines/", "");
          const pipeline = await getPipeline(id);
          if (!pipeline) {
            return Response.json({ error: "Pipeline not found" }, { status: 404 });
          }
          return Response.json(pipeline);
        }

        if (pathname === "/api/outputs") {
          return Response.json(await getOutputs());
        }

        if (pathname.startsWith("/api/outputs/")) {
          const filename = pathname.replace("/api/outputs/", "");
          const output = await getOutput(filename);
          if (!output) {
            return Response.json({ error: "Output not found" }, { status: 404 });
          }
          return Response.json(output);
        }

        // Static files
        let filePath = pathname === "/" ? "/index.html" : pathname;
        const fullPath = path.join(webDistDir, filePath);

        const file = Bun.file(fullPath);
        if (await file.exists()) {
          return new Response(file);
        }

        // SPA fallback
        return new Response(Bun.file(path.join(webDistDir, "index.html")), {
          headers: { "Content-Type": "text/html" },
        });
      },
    });

    console.log(chalk.green(`\n🚀 Pipeline Viewer running at http://localhost:${server.port}\n`));
    console.log(chalk.dim(`   Pipelines: ${pipelinesDir}`));
    console.log(chalk.dim(`   Outputs:   ${outputsDir}\n`));
    console.log(chalk.dim("   Press Ctrl+C to stop\n"));
  } else {
    // Use Node.js http module
    const http = await import("node:http");

    const mimeTypes: Record<string, string> = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".map": "application/json",
    };

    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url || "/", `http://localhost:${port}`);
      const pathname = url.pathname;

      try {
        // API routes
        if (pathname === "/api/pipelines") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(await getPipelines()));
          return;
        }

        if (pathname.startsWith("/api/pipelines/")) {
          const id = pathname.replace("/api/pipelines/", "");
          const pipeline = await getPipeline(id);
          res.writeHead(pipeline ? 200 : 404, { "Content-Type": "application/json" });
          res.end(JSON.stringify(pipeline || { error: "Pipeline not found" }));
          return;
        }

        if (pathname === "/api/outputs") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(await getOutputs()));
          return;
        }

        if (pathname.startsWith("/api/outputs/")) {
          const filename = pathname.replace("/api/outputs/", "");
          const output = await getOutput(filename);
          res.writeHead(output ? 200 : 404, { "Content-Type": "application/json" });
          res.end(JSON.stringify(output || { error: "Output not found" }));
          return;
        }

        // Static files
        let filePath = pathname === "/" ? "/index.html" : pathname;
        const fullPath = path.join(webDistDir, filePath);

        if (await fileExists(fullPath)) {
          const ext = path.extname(fullPath);
          const content = await fs.readFile(fullPath);
          res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
          res.end(content);
          return;
        }

        // SPA fallback
        const indexPath = path.join(webDistDir, "index.html");
        const indexContent = await fs.readFile(indexPath);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(indexContent);
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });

    server.listen(port, () => {
      console.log(chalk.green(`\n🚀 Pipeline Viewer running at http://localhost:${port}\n`));
      console.log(chalk.dim(`   Pipelines: ${pipelinesDir}`));
      console.log(chalk.dim(`   Outputs:   ${outputsDir}\n`));
      console.log(chalk.dim("   Press Ctrl+C to stop\n"));
    });
  }

  // Keep the process running
  await new Promise(() => {});
}

export const webCommandConfig = {
  command: "web",
  describe: "Start the Pipeline Viewer web interface",
  builder: {
    port: {
      alias: "p",
      type: "number" as const,
      describe: "Port to run the web server on",
      default: 3000,
    },
  },
  handler: webCommand,
};
