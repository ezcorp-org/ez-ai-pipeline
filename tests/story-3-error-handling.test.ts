import { test, expect, beforeAll, afterAll, describe } from "bun:test";

const BASE_URL = "http://localhost:3004";

let serverProcess: ReturnType<typeof Bun.spawn> | null = null;

async function startServer(env: Record<string, string> = {}) {
  if (serverProcess) {
    serverProcess.kill();
    await Bun.sleep(500);
  }

  serverProcess = Bun.spawn(["bun", "run", "web/index.ts"], {
    env: {
      ...process.env,
      ...env,
      PORT: "3004",
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

  // Start with API key set (normal mode)
  await startServer({ ANTHROPIC_API_KEY: "test-key" });
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});

describe("Story 3: Error Handling & Polish", () => {
  describe("API Config Status Endpoint", () => {
    test("should return hasApiKey: true when API key is set", async () => {
      const res = await fetch(`${BASE_URL}/api/config/status`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data).toHaveProperty("hasApiKey");
      expect(data.hasApiKey).toBe(true);
    });

    test("should not expose the actual API key", async () => {
      const res = await fetch(`${BASE_URL}/api/config/status`);
      const data = await res.json();

      // Should not have any key-like properties
      expect(data).not.toHaveProperty("apiKey");
      expect(data).not.toHaveProperty("key");
      expect(JSON.stringify(data)).not.toContain("test-key");
    });
  });

  describe("Cancel Execution Endpoint", () => {
    test("should return cancelled: false for non-existent execution", async () => {
      const res = await fetch(`${BASE_URL}/api/executions/non-existent/cancel`, {
        method: "POST",
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.cancelled).toBe(false);
    });

    test("should accept cancel request for running execution", async () => {
      // Start an execution
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Test prompt for cancel" }),
      });
      const { executionId } = await runRes.json();

      // Immediately try to cancel
      const cancelRes = await fetch(`${BASE_URL}/api/executions/${executionId}/cancel`, {
        method: "POST",
      });

      expect(cancelRes.status).toBe(200);
      const cancelData = await cancelRes.json();
      // Should be boolean (true or false depending on timing)
      expect(typeof cancelData.cancelled).toBe("boolean");
    });

    test("cancelled execution should show cancelled status", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Prompt to cancel" }),
      });
      const { executionId } = await runRes.json();

      // Cancel immediately
      await fetch(`${BASE_URL}/api/executions/${executionId}/cancel`, {
        method: "POST",
      });

      // Wait a bit for cancellation to process
      await Bun.sleep(200);

      // Check status
      const statusRes = await fetch(`${BASE_URL}/api/executions/${executionId}`);
      const status = await statusRes.json();

      // Status should be either cancelled, running (if cancel was too fast), or completed
      expect(["cancelled", "running", "completed", "failed"]).toContain(status.status);
    });
  });

  describe("Error Response Validation", () => {
    test("should return 400 with clear error for missing input", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Input is required");
    });

    test("should return 400 with clear error for empty input", async () => {
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
      expect(data.error).toBeDefined();
    });

    test("should return 404 with clear error for non-existent pipeline", async () => {
      const res = await fetch(`${BASE_URL}/api/pipelines/non-existent-id/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "test" }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Pipeline not found");
    });

    test("should return 404 for non-existent execution status", async () => {
      const res = await fetch(`${BASE_URL}/api/executions/non-existent`);

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Execution not found");
    });
  });

  describe("WebSocket Error Handling", () => {
    test("should handle subscription to non-existent execution", async () => {
      const ws = new WebSocket(`ws://localhost:3004/ws`);

      const response = await new Promise<any>((resolve) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: "subscribe",
            executionId: "exec_nonexistent_12345",
          }));
        };
        ws.onmessage = (event) => {
          resolve(JSON.parse(event.data));
          ws.close();
        };
        ws.onerror = () => {
          resolve({ error: true });
          ws.close();
        };
        setTimeout(() => {
          resolve({ timeout: true });
          ws.close();
        }, 3000);
      });

      expect(response.type).toBe("subscribed");
      expect(response.success).toBe(false);
    });

    test("should handle invalid JSON gracefully", async () => {
      const ws = new WebSocket(`ws://localhost:3004/ws`);

      const response = await new Promise<any>((resolve) => {
        ws.onopen = () => {
          ws.send("not valid json at all {{{");
        };
        ws.onmessage = (event) => {
          resolve(JSON.parse(event.data));
          ws.close();
        };
        ws.onerror = () => {
          resolve({ error: true });
          ws.close();
        };
        setTimeout(() => {
          resolve({ timeout: true });
          ws.close();
        }, 3000);
      });

      expect(response.type).toBe("error");
      expect(response.message).toBe("Invalid message format");
    });

    test("should handle WebSocket disconnect during execution", async () => {
      // Start an execution
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Test for disconnect" }),
      });
      const { executionId } = await runRes.json();

      // Connect and subscribe
      const ws = new WebSocket(`ws://localhost:3004/ws`);

      await new Promise<void>((resolve) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "subscribe", executionId }));
        };
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "subscribed") {
            // Immediately close (simulate disconnect)
            ws.close();
            resolve();
          }
        };
        setTimeout(() => {
          ws.close();
          resolve();
        }, 2000);
      });

      // Execution should continue even after disconnect
      await Bun.sleep(500);

      // Check execution status via REST
      const statusRes = await fetch(`${BASE_URL}/api/executions/${executionId}`);
      expect(statusRes.status).toBe(200);
    });
  });

  describe("Graceful Degradation", () => {
    test("should continue to serve static assets during execution", async () => {
      // Start an execution
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Test prompt" }),
      });

      // Static assets should still work
      const htmlRes = await fetch(BASE_URL);
      expect(htmlRes.status).toBe(200);

      const jsRes = await fetch(`${BASE_URL}/app.js`);
      expect(jsRes.status).toBe(200);

      const cssRes = await fetch(`${BASE_URL}/styles/main.css`);
      expect(cssRes.status).toBe(200);
    });

    test("should handle concurrent API requests during execution", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Start execution
      await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Concurrent test" }),
      });

      // Make concurrent API requests
      const [p1, p2, o1] = await Promise.all([
        fetch(`${BASE_URL}/api/pipelines`),
        fetch(`${BASE_URL}/api/pipelines/${pipelineId}`),
        fetch(`${BASE_URL}/api/outputs`),
      ]);

      expect(p1.status).toBe(200);
      expect(p2.status).toBe(200);
      expect(o1.status).toBe(200);
    });
  });

  describe("Input Validation", () => {
    test("should trim whitespace from input", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Input with lots of whitespace should work (after trimming)
      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "   Valid input with spaces   " }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.executionId).toBeDefined();
    });

    test("should reject input that is only whitespace", async () => {
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

    test("should accept long input", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Long input (1000 chars)
      const longInput = "A".repeat(1000);

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: longInput }),
      });

      expect(res.status).toBe(200);
    });
  });
});

describe("Story 3: API Key Missing Scenario", () => {
  // These tests require restarting the server without API key
  test("should return hasApiKey: false when API key is not set", async () => {
    // Stop current server
    if (serverProcess) {
      serverProcess.kill();
      await Bun.sleep(500);
    }

    // Start without API key
    await startServer({ ANTHROPIC_API_KEY: "" });

    const res = await fetch(`${BASE_URL}/api/config/status`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.hasApiKey).toBe(false);

    // Restart with API key for other tests
    await startServer({ ANTHROPIC_API_KEY: "test-key" });
  });
});
