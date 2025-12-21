import { test, expect, beforeAll, afterAll, describe } from "bun:test";

const BASE_URL = "http://localhost:3002";
const WS_URL = "ws://localhost:3002/ws";

let serverProcess: ReturnType<typeof Bun.spawn>;

beforeAll(async () => {
  // Start the server on a test port
  serverProcess = Bun.spawn(["bun", "run", "web/index.ts"], {
    env: {
      ...process.env,
      PORT: "3002",
    },
    stdout: "pipe",
    stderr: "pipe",
  });

  // Wait for server to be ready
  let retries = 20;
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
});

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

describe("Story 1: Backend Pipeline Execution API", () => {
  describe("GET /api/pipelines (existing functionality)", () => {
    test("should return list of pipelines", async () => {
      const res = await fetch(`${BASE_URL}/api/pipelines`);
      expect(res.status).toBe(200);

      const pipelines = await res.json();
      expect(Array.isArray(pipelines)).toBe(true);
      expect(pipelines.length).toBeGreaterThan(0);

      // Check pipeline structure
      const pipeline = pipelines[0];
      expect(pipeline).toHaveProperty("id");
      expect(pipeline).toHaveProperty("name");
      expect(pipeline).toHaveProperty("stageCount");
    });
  });

  describe("GET /api/pipelines/:id (existing functionality)", () => {
    test("should return pipeline by id", async () => {
      // First get list to find a valid ID
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}`);
      expect(res.status).toBe(200);

      const pipeline = await res.json();
      expect(pipeline).toHaveProperty("pipeline");
      expect(pipeline).toHaveProperty("stages");
      expect(pipeline.pipeline.id).toBe(pipelineId);
    });

    test("should return 404 for non-existent pipeline", async () => {
      const res = await fetch(`${BASE_URL}/api/pipelines/non-existent-id`);
      expect(res.status).toBe(404);

      const data = await res.json();
      expect(data.error).toBe("Pipeline not found");
    });
  });

  describe("POST /api/pipelines/:id/run", () => {
    test("should return 404 for non-existent pipeline", async () => {
      const res = await fetch(`${BASE_URL}/api/pipelines/non-existent/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "test input" }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Pipeline not found");
    });

    test("should return 400 for missing input", async () => {
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

    test("should return 400 for empty input", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "   " }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Input is required");
    });

    test("should start execution and return execution ID", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const res = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Test prompt for optimization" }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("executionId");
      expect(data.executionId).toMatch(/^exec_\d+_[a-z0-9]+$/);
      expect(data.pipelineId).toBe(pipelineId);
      expect(data.status).toBe("started");
    });
  });

  describe("GET /api/executions/:id", () => {
    test("should return 404 for non-existent execution", async () => {
      const res = await fetch(`${BASE_URL}/api/executions/exec_nonexistent`);
      expect(res.status).toBe(404);

      const data = await res.json();
      expect(data.error).toBe("Execution not found");
    });

    test("should return execution status", async () => {
      // Start an execution first
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Another test prompt" }),
      });
      const runData = await runRes.json();

      const res = await fetch(`${BASE_URL}/api/executions/${runData.executionId}`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.id).toBe(runData.executionId);
      expect(data.pipelineId).toBe(pipelineId);
      expect(["running", "completed", "failed", "cancelled"]).toContain(data.status);
    });
  });

  describe("POST /api/executions/:id/cancel", () => {
    test("should return cancelled: false for non-existent execution", async () => {
      const res = await fetch(`${BASE_URL}/api/executions/exec_nonexistent/cancel`, {
        method: "POST",
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.cancelled).toBe(false);
    });

    test("should cancel a running execution", async () => {
      // Start an execution
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Prompt to cancel" }),
      });
      const runData = await runRes.json();

      // Cancel it immediately
      const cancelRes = await fetch(`${BASE_URL}/api/executions/${runData.executionId}/cancel`, {
        method: "POST",
      });

      expect(cancelRes.status).toBe(200);
      const cancelData = await cancelRes.json();
      // May be true or false depending on timing
      expect(typeof cancelData.cancelled).toBe("boolean");
    });
  });

  describe("WebSocket /ws", () => {
    test("should connect to WebSocket", async () => {
      const ws = new WebSocket(WS_URL);

      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => {
          ws.close();
          resolve();
        };
        ws.onerror = reject;
        setTimeout(() => reject(new Error("WebSocket connection timeout")), 5000);
      });
    });

    test("should handle subscribe message", async () => {
      const ws = new WebSocket(WS_URL);

      const response = await new Promise<any>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: "subscribe",
            executionId: "exec_test_123",
          }));
        };
        ws.onmessage = (event) => {
          resolve(JSON.parse(event.data));
          ws.close();
        };
        ws.onerror = reject;
        setTimeout(() => reject(new Error("WebSocket message timeout")), 5000);
      });

      expect(response.type).toBe("subscribed");
      expect(response.executionId).toBe("exec_test_123");
      // success will be false since execution doesn't exist
      expect(response.success).toBe(false);
    });

    test("should handle unsubscribe message", async () => {
      const ws = new WebSocket(WS_URL);

      const response = await new Promise<any>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: "unsubscribe",
            executionId: "exec_test_123",
          }));
        };
        ws.onmessage = (event) => {
          resolve(JSON.parse(event.data));
          ws.close();
        };
        ws.onerror = reject;
        setTimeout(() => reject(new Error("WebSocket message timeout")), 5000);
      });

      expect(response.type).toBe("unsubscribed");
      expect(response.executionId).toBe("exec_test_123");
    });

    test("should handle invalid message format", async () => {
      const ws = new WebSocket(WS_URL);

      const response = await new Promise<any>((resolve, reject) => {
        ws.onopen = () => {
          ws.send("not valid json");
        };
        ws.onmessage = (event) => {
          resolve(JSON.parse(event.data));
          ws.close();
        };
        ws.onerror = reject;
        setTimeout(() => reject(new Error("WebSocket message timeout")), 5000);
      });

      expect(response.type).toBe("error");
      expect(response.message).toBe("Invalid message format");
    });

    test("should subscribe to real execution and receive events", async () => {
      // Start an execution
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      const runRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "WebSocket test prompt" }),
      });
      const runData = await runRes.json();

      // Connect WebSocket and subscribe
      const ws = new WebSocket(WS_URL);

      const events: any[] = [];
      await new Promise<void>((resolve, reject) => {
        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: "subscribe",
            executionId: runData.executionId,
          }));
        };
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          events.push(data);

          // Check if we got the subscription confirmation
          if (data.type === "subscribed") {
            // May also receive execution events if already in progress
            // Give it a moment then close
            setTimeout(() => {
              ws.close();
              resolve();
            }, 500);
          }
        };
        ws.onerror = reject;
        setTimeout(() => {
          ws.close();
          resolve(); // Timeout is okay, we just want to collect some events
        }, 3000);
      });

      // Should have at least the subscription confirmation
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[0].type).toBe("subscribed");
      expect(events[0].success).toBe(true);
    });
  });

  describe("GET /api/outputs (existing functionality)", () => {
    test("should return list of outputs", async () => {
      const res = await fetch(`${BASE_URL}/api/outputs`);
      expect(res.status).toBe(200);

      const outputs = await res.json();
      expect(Array.isArray(outputs)).toBe(true);
    });
  });
});
