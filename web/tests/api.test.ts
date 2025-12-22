import { describe, test, expect, beforeAll, afterAll } from "bun:test";

const BASE_URL = process.env.TEST_URL || "http://localhost:3130";

describe("API E2E Tests", () => {
  // Helper to make API requests
  async function api(path: string, options?: RequestInit) {
    const response = await fetch(`${BASE_URL}${path}`, options);
    return response;
  }

  describe("Health & Config", () => {
    test("GET /api/config/status returns config status", async () => {
      const response = await api("/api/config/status");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("hasApiKey");
      expect(data).toHaveProperty("cliTools");
      expect(data.cliTools).toHaveProperty("claude");
      expect(data.cliTools).toHaveProperty("opencode");
      expect(data.cliTools).toHaveProperty("aider");
    });
  });

  describe("Pipelines API", () => {
    test("GET /api/pipelines returns list of pipelines", async () => {
      const response = await api("/api/pipelines");
      expect(response.ok).toBe(true);

      const pipelines = await response.json();
      expect(Array.isArray(pipelines)).toBe(true);
      expect(pipelines.length).toBeGreaterThan(0);

      // Check first pipeline has required fields
      const pipeline = pipelines[0];
      expect(pipeline).toHaveProperty("id");
      expect(pipeline).toHaveProperty("name");
      expect(pipeline).toHaveProperty("filename");
      expect(pipeline).toHaveProperty("stageCount");
      expect(pipeline).toHaveProperty("defaultProvider");
    });

    test("GET /api/pipelines/:id returns pipeline details", async () => {
      // First get list to find a valid ID
      const listResponse = await api("/api/pipelines");
      const pipelines = await listResponse.json();
      const pipelineId = pipelines[0].id;

      const response = await api(`/api/pipelines/${pipelineId}`);
      expect(response.ok).toBe(true);

      const pipeline = await response.json();
      expect(pipeline).toHaveProperty("pipeline");
      expect(pipeline).toHaveProperty("stages");
      expect(pipeline.pipeline.id).toBe(pipelineId);
      expect(Array.isArray(pipeline.stages)).toBe(true);
    });

    test("GET /api/pipelines/:id returns 404 for non-existent pipeline", async () => {
      const response = await api("/api/pipelines/non-existent-pipeline-xyz");
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data).toHaveProperty("error");
    });
  });

  describe("Executions API", () => {
    test("GET /api/executions returns list of active executions", async () => {
      const response = await api("/api/executions");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("executions");
      expect(Array.isArray(data.executions)).toBe(true);
    });

    test("GET /api/executions/running returns running executions with count", async () => {
      const response = await api("/api/executions/running");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("executions");
      expect(data).toHaveProperty("count");
      expect(Array.isArray(data.executions)).toBe(true);
      expect(typeof data.count).toBe("number");
    });

    test("GET /api/executions/history returns paginated history", async () => {
      const response = await api("/api/executions/history");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty("executions");
      expect(data).toHaveProperty("page");
      expect(data).toHaveProperty("pageSize");
      expect(data).toHaveProperty("totalPages");
      expect(data).toHaveProperty("total");
      expect(Array.isArray(data.executions)).toBe(true);
    });

    test("GET /api/executions/history supports pagination params", async () => {
      const response = await api("/api/executions/history?page=1&pageSize=5");
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.page).toBe(1);
      expect(data.pageSize).toBe(5);
    });

    test("GET /api/executions/:id returns 404 for non-existent execution", async () => {
      const response = await api("/api/executions/non-existent-execution-xyz");
      expect(response.status).toBe(404);
    });

    test("POST /api/pipelines/:id/run requires input", async () => {
      const listResponse = await api("/api/pipelines");
      const pipelines = await listResponse.json();
      const pipelineId = pipelines[0].id;

      const response = await api(`/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Input is required");
    });

    test("POST /api/pipelines/:id/run rejects empty input", async () => {
      const listResponse = await api("/api/pipelines");
      const pipelines = await listResponse.json();
      const pipelineId = pipelines[0].id;

      const response = await api(`/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "   " }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Outputs API", () => {
    test("GET /api/outputs returns list of outputs", async () => {
      const response = await api("/api/outputs");
      expect(response.ok).toBe(true);

      const outputs = await response.json();
      expect(Array.isArray(outputs)).toBe(true);

      // If there are outputs, check structure
      if (outputs.length > 0) {
        const output = outputs[0];
        expect(output).toHaveProperty("filename");
        expect(output).toHaveProperty("pipelineId");
        expect(output).toHaveProperty("status");
        expect(output).toHaveProperty("timestamp");
      }
    });

    test("GET /api/outputs/:filename returns 404 for non-existent output", async () => {
      const response = await api("/api/outputs/non-existent-output.json");
      expect(response.status).toBe(404);
    });
  });

  describe("Static Files & SPA", () => {
    test("GET / returns index.html", async () => {
      const response = await api("/");
      expect(response.ok).toBe(true);
      expect(response.headers.get("content-type")).toContain("text/html");
    });

    test("GET /pipelines returns index.html (SPA fallback)", async () => {
      const response = await api("/pipelines");
      expect(response.ok).toBe(true);
      expect(response.headers.get("content-type")).toContain("text/html");
    });

    test("GET /running returns index.html (SPA fallback)", async () => {
      const response = await api("/running");
      expect(response.ok).toBe(true);
      expect(response.headers.get("content-type")).toContain("text/html");
    });

    test("GET /executions/some-id returns index.html (SPA fallback)", async () => {
      const response = await api("/executions/some-id");
      expect(response.ok).toBe(true);
      expect(response.headers.get("content-type")).toContain("text/html");
    });
  });

  describe("WebSocket", () => {
    test("WebSocket endpoint exists at /ws", async () => {
      // We can't fully test WebSocket with fetch, but we can verify the upgrade fails gracefully
      const response = await api("/ws");
      // Should return 400 because it expects a WebSocket upgrade
      expect(response.status).toBe(400);
    });
  });
});

describe("Execution History Validation", () => {
  test("History records have correct structure", async () => {
    const response = await fetch(`${BASE_URL}/api/executions/history`);
    const data = await response.json();

    if (data.executions.length > 0) {
      const record = data.executions[0];

      // Required fields
      expect(record).toHaveProperty("id");
      expect(record).toHaveProperty("pipelineId");
      expect(record).toHaveProperty("pipelineName");
      expect(record).toHaveProperty("status");
      expect(record).toHaveProperty("startTime");
      expect(record).toHaveProperty("duration");
      expect(record).toHaveProperty("totalStages");
      expect(record).toHaveProperty("stagesRun");
      expect(record).toHaveProperty("inputPreview");
      expect(record).toHaveProperty("totalCost");

      // Status should be valid
      expect(["completed", "failed", "cancelled"]).toContain(record.status);

      // Numeric fields
      expect(typeof record.duration).toBe("number");
      expect(typeof record.totalCost).toBe("number");
      expect(typeof record.stagesRun).toBe("number");
    }
  });
});
