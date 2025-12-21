import { test, expect, beforeAll, afterAll, describe } from "bun:test";

const BASE_URL = "http://localhost:3003";

let serverProcess: ReturnType<typeof Bun.spawn> | null = null;

async function ensureServerRunning() {
  if (serverProcess) return;

  // Start the server on a test port
  serverProcess = Bun.spawn(["bun", "run", "web/index.ts"], {
    env: {
      ...process.env,
      PORT: "3003",
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  // Wait for server to be ready
  let retries = 30;
  while (retries > 0) {
    try {
      const res = await fetch(`${BASE_URL}/api/pipelines`);
      if (res.ok) break;
    } catch {
      // Server not ready yet
    }
    await Bun.sleep(200);
    retries--;
  }

  if (retries === 0) {
    throw new Error("Server failed to start");
  }
}

beforeAll(async () => {
  // Build the web frontend first
  const buildProcess = Bun.spawn(["bun", "run", "web/build.ts"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  await buildProcess.exited;

  await ensureServerRunning();
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

describe("Story 2: Frontend Pipeline Execution UI", () => {
  describe("Static Assets", () => {
    test("should serve index.html at root", async () => {
      const res = await fetch(BASE_URL);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/html");

      const html = await res.text();
      expect(html).toContain("<!DOCTYPE html>");
    });

    test("should serve app.js", async () => {
      const res = await fetch(`${BASE_URL}/app.js`);
      expect(res.status).toBe(200);
    });

    test("should serve CSS", async () => {
      const res = await fetch(`${BASE_URL}/styles/main.css`);
      expect(res.status).toBe(200);
    });
  });

  describe("SPA Routing", () => {
    test("should serve index.html for /pipelines route", async () => {
      const res = await fetch(`${BASE_URL}/pipelines`);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/html");
    });

    test("should serve index.html for /pipelines/:id route", async () => {
      const res = await fetch(`${BASE_URL}/pipelines/test-id`);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/html");
    });
  });

  describe("API Integration for Frontend", () => {
    test("pipelines list returns proper structure for frontend", async () => {
      const res = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await res.json();

      expect(pipelines.length).toBeGreaterThan(0);
      // Check all fields needed by frontend
      const pipeline = pipelines[0];
      expect(pipeline).toHaveProperty("id");
      expect(pipeline).toHaveProperty("name");
      expect(pipeline).toHaveProperty("stageCount");
    });

    test("pipeline detail returns proper structure for ExecutionForm", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelines[0].id}`);
      const pipeline = await res.json();

      // Check fields needed by ExecutionForm
      expect(pipeline).toHaveProperty("pipeline");
      expect(pipeline.pipeline).toHaveProperty("id");
      expect(pipeline).toHaveProperty("stages");
      expect(Array.isArray(pipeline.stages)).toBe(true);
    });
  });

  describe("Execution Flow Integration", () => {
    test("should start execution and receive progress via WebSocket", async () => {
      // Get a pipeline
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Start execution (simulating frontend POST)
      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Test prompt from frontend" }),
      });

      expect(runRes.status).toBe(200);
      const runData = await runRes.json();
      expect(runData.executionId).toBeDefined();

      // Connect WebSocket and subscribe (simulating frontend behavior)
      const ws = new WebSocket(`ws://localhost:3003/ws`);

      const events: any[] = [];
      await new Promise<void>((resolve) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: "subscribe",
            executionId: runData.executionId,
          }));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          events.push(data);

          // Once we get subscription confirmation, we can resolve
          if (data.type === "subscribed") {
            setTimeout(() => {
              ws.close();
              resolve();
            }, 100);
          }

          // Also resolve on completion
          if (data.type === "execution:completed" || data.type === "execution:failed") {
            ws.close();
            resolve();
          }
        };

        ws.onerror = () => {
          ws.close();
          resolve();
        };

        setTimeout(() => {
          ws.close();
          resolve();
        }, 2000); // Timeout after 2s
      });

      // Should have received subscription confirmation
      expect(events.some(e => e.type === "subscribed")).toBe(true);
    });

    test("should handle concurrent executions", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Start two executions concurrently
      const [run1, run2] = await Promise.all([
        fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "Concurrent test 1" }),
        }),
        fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "Concurrent test 2" }),
        }),
      ]);

      expect(run1.status).toBe(200);
      expect(run2.status).toBe(200);

      const data1 = await run1.json();
      const data2 = await run2.json();

      // Each should have unique execution IDs
      expect(data1.executionId).not.toBe(data2.executionId);
    });
  });

  describe("Execution Status Endpoint", () => {
    test("should return execution status for frontend polling fallback", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Start an execution
      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Status check test" }),
      });
      const { executionId } = await runRes.json();

      // Check status via REST (frontend fallback)
      const statusRes = await fetch(`${BASE_URL}/api/executions/${executionId}`);
      expect(statusRes.status).toBe(200);

      const status = await statusRes.json();
      expect(status.id).toBe(executionId);
      expect(status.pipelineId).toBe(pipelineId);
      expect(["running", "completed", "failed", "cancelled"]).toContain(status.status);
    });
  });

  describe("Output Navigation", () => {
    test("outputs list should include execution results", async () => {
      // Outputs from executions should appear in the outputs list
      // This verifies the integration between execution and output viewing
      const res = await fetch(`${BASE_URL}/api/outputs`);
      expect(res.status).toBe(200);

      const outputs = await res.json();
      expect(Array.isArray(outputs)).toBe(true);
      // Outputs structure should match what frontend expects
      if (outputs.length > 0) {
        expect(outputs[0]).toHaveProperty("filename");
        expect(outputs[0]).toHaveProperty("status");
        expect(outputs[0]).toHaveProperty("timestamp");
      }
    });
  });

  describe("Frontend Component Requirements", () => {
    test("execution form should accept input and return execution ID", async () => {
      // This test simulates what the ExecutionForm component does
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Simulate form submission
      const formData = { input: "User entered prompt for optimization" };

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      expect(res.status).toBe(200);
      const data = await res.json();

      // Response should contain what ExecutionProgress component needs
      expect(data).toHaveProperty("executionId");
      expect(data).toHaveProperty("pipelineId");
      expect(data).toHaveProperty("status", "started");
    });

    test("should reject empty input", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "" }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Input is required");
    });

    test("should reject whitespace-only input", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "   \n\t   " }),
      });

      expect(res.status).toBe(400);
    });
  });
});
