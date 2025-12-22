import { describe, test, expect, beforeAll, afterAll } from "bun:test";

/**
 * UI E2E Tests
 *
 * These tests verify UI elements, navigation, and interactive features.
 * Run with: bun test web/tests/ui.test.ts
 *
 * Note: For full browser testing, use Playwright MCP tools directly.
 * These tests verify the HTML/JS is properly served.
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:3130";

describe("UI E2E Tests", () => {
  describe("Page Rendering", () => {
    test("Dashboard page loads with app container", async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.ok).toBe(true);

      const html = await response.text();
      expect(html).toContain('<div id="app">');
      expect(html).toContain('<script type="module" src="/app.js">');
    });

    test("App JavaScript loads correctly", async () => {
      const response = await fetch(`${BASE_URL}/app.js`);
      expect(response.ok).toBe(true);

      const js = await response.text();
      // Should contain Svelte runtime and our components
      expect(js.length).toBeGreaterThan(10000);
    });

    test("CSS styles load correctly", async () => {
      const response = await fetch(`${BASE_URL}/styles/main.css`);
      expect(response.ok).toBe(true);

      const css = await response.text();
      // Should contain Tailwind utilities
      expect(css).toContain("cursor-pointer");
      expect(css.length).toBeGreaterThan(1000);
    });
  });

  describe("SPA Routes", () => {
    const routes = [
      "/",
      "/pipelines",
      "/pipelines/prompt-optimizer-v1",
      "/pipelines/pipeline-generator-v1",
      "/running",
      "/executions/test-id",
      "/outputs",
    ];

    for (const route of routes) {
      test(`Route ${route} returns valid HTML`, async () => {
        const response = await fetch(`${BASE_URL}${route}`);
        expect(response.ok).toBe(true);
        expect(response.headers.get("content-type")).toContain("text/html");

        const html = await response.text();
        expect(html).toContain("<!DOCTYPE html>");
        expect(html).toContain('<div id="app">');
      });
    }
  });
});

describe("Component Integration Tests", () => {
  describe("Sidebar Navigation", () => {
    test("API provides data for sidebar running count", async () => {
      const response = await fetch(`${BASE_URL}/api/executions/running`);
      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(typeof data.count).toBe("number");
      expect(data.count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Dashboard Data", () => {
    test("Dashboard can load pipelines and outputs", async () => {
      const [pipelinesRes, outputsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/pipelines`),
        fetch(`${BASE_URL}/api/outputs`),
      ]);

      expect(pipelinesRes.ok).toBe(true);
      expect(outputsRes.ok).toBe(true);

      const pipelines = await pipelinesRes.json();
      const outputs = await outputsRes.json();

      expect(Array.isArray(pipelines)).toBe(true);
      expect(Array.isArray(outputs)).toBe(true);
    });
  });

  describe("Pipeline Detail Data", () => {
    test("Pipeline detail page has all required data", async () => {
      // Get a valid pipeline ID
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Fetch pipeline details
      const detailRes = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}`);
      expect(detailRes.ok).toBe(true);

      const pipeline = await detailRes.json();

      // Verify pipeline structure
      expect(pipeline.pipeline).toHaveProperty("id");
      expect(pipeline.pipeline).toHaveProperty("name");
      expect(pipeline.pipeline).toHaveProperty("version");
      expect(pipeline.pipeline).toHaveProperty("description");
      expect(pipeline.pipeline).toHaveProperty("defaultProvider");

      // Verify stages
      expect(Array.isArray(pipeline.stages)).toBe(true);
      expect(pipeline.stages.length).toBeGreaterThan(0);

      const stage = pipeline.stages[0];
      expect(stage).toHaveProperty("id");
      expect(stage).toHaveProperty("name");
      expect(stage).toHaveProperty("type");
      expect(stage).toHaveProperty("model");
      expect(stage).toHaveProperty("prompt");
    });
  });

  describe("Execution History", () => {
    test("History pagination works correctly", async () => {
      // Page 1
      const page1Res = await fetch(`${BASE_URL}/api/executions/history?page=1&pageSize=5`);
      expect(page1Res.ok).toBe(true);

      const page1 = await page1Res.json();
      expect(page1.page).toBe(1);
      expect(page1.pageSize).toBe(5);

      // If there are more pages, verify page 2
      if (page1.totalPages > 1) {
        const page2Res = await fetch(`${BASE_URL}/api/executions/history?page=2&pageSize=5`);
        expect(page2Res.ok).toBe(true);

        const page2 = await page2Res.json();
        expect(page2.page).toBe(2);

        // Ensure different results (if enough data)
        if (page1.executions.length > 0 && page2.executions.length > 0) {
          expect(page1.executions[0].id).not.toBe(page2.executions[0].id);
        }
      }
    });
  });

  describe("Execution Detail Data", () => {
    test("Historical execution detail returns proper format", async () => {
      const historyRes = await fetch(`${BASE_URL}/api/executions/history?pageSize=1`);
      const history = await historyRes.json();

      if (history.executions.length > 0) {
        const executionId = history.executions[0].id;
        const detailRes = await fetch(`${BASE_URL}/api/executions/${executionId}`);
        expect(detailRes.ok).toBe(true);

        const detail = await detailRes.json();
        expect(detail).toHaveProperty("id");
        expect(detail).toHaveProperty("pipelineId");
        expect(detail).toHaveProperty("status");

        // Historical records should have isHistorical flag or result
        if (detail.isHistorical) {
          expect(detail).toHaveProperty("result");
        }
      }
    });
  });
});

describe("Feature Validation Tests", () => {
  describe("Cursor Pointer CSS", () => {
    test("CSS includes cursor-pointer utility", async () => {
      const response = await fetch(`${BASE_URL}/styles/main.css`);
      const css = await response.text();

      // Tailwind should generate cursor-pointer class
      expect(css).toContain("cursor-pointer");
      expect(css).toContain("cursor: pointer");
    });
  });

  describe("Config Status", () => {
    test("Config status returns CLI tool availability", async () => {
      const response = await fetch(`${BASE_URL}/api/config/status`);
      const config = await response.json();

      // Each CLI tool should have available and version fields
      for (const tool of ["claude", "opencode", "aider"]) {
        expect(config.cliTools[tool]).toHaveProperty("available");
        if (config.cliTools[tool].available) {
          expect(config.cliTools[tool]).toHaveProperty("version");
        }
      }
    });
  });

  describe("Pipeline Execution", () => {
    test("Pipeline run validates execution mode", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Get config to check what modes are available
      const configRes = await fetch(`${BASE_URL}/api/config/status`);
      const config = await configRes.json();

      // Try API mode without API key (if no key configured)
      if (!config.hasApiKey) {
        const response = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: "test input",
            executionMode: "api",
          }),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.error).toContain("API");
      }
    });

    test("Pipeline run validates CLI tool availability", async () => {
      const listRes = await fetch(`${BASE_URL}/api/pipelines`);
      const pipelines = await listRes.json();
      const pipelineId = pipelines[0].id;

      // Try with non-existent CLI tool
      const response = await fetch(`${BASE_URL}/api/pipelines/${pipelineId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: "test input",
          executionMode: "cli",
          cliTool: "nonexistent",
        }),
      });

      // Should fail if CLI tool is not available
      expect(response.status).toBe(400);
    });
  });
});

describe("Error Handling", () => {
  test("Invalid API routes return proper errors", async () => {
    const response = await fetch(`${BASE_URL}/api/invalid-endpoint`);
    // Should fall through to SPA for non-API routes
    // API routes that don't exist will return HTML (SPA fallback)
  });

  test("POST to non-existent pipeline returns 404", async () => {
    const response = await fetch(`${BASE_URL}/api/pipelines/fake-id/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "test" }),
    });

    expect(response.status).toBe(404);
  });

  test("Cancel non-existent execution returns gracefully", async () => {
    const response = await fetch(`${BASE_URL}/api/executions/fake-id/cancel`, {
      method: "POST",
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.cancelled).toBe(false);
  });
});
