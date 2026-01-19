import { describe, test, expect } from "bun:test";

/**
 * Browser E2E Tests using Playwright
 *
 * These tests are designed to be run via Playwright MCP tools.
 * They test actual browser interactions and UI functionality.
 *
 * To run manually with Playwright:
 *   bunx playwright test web/tests/browser.test.ts
 *
 * Or use the MCP browser tools for interactive testing.
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:3130";

// Test scenarios to run via Playwright MCP tools
export const browserTestScenarios = {
  /**
   * Test 1: Dashboard loads and displays pipelines
   */
  dashboardLoads: {
    description: "Dashboard page loads with pipelines and recent runs",
    steps: [
      { action: "navigate", url: `${BASE_URL}/` },
      { action: "waitFor", text: "Dashboard" },
      { action: "verify", element: "h1", contains: "Dashboard" },
      { action: "verify", element: ".text-3xl", exists: true }, // Stats cards
    ],
  },

  /**
   * Test 2: Pipeline list navigation
   */
  pipelineListNavigation: {
    description: "Navigate to pipelines list and click a pipeline",
    steps: [
      { action: "navigate", url: `${BASE_URL}/pipelines` },
      { action: "waitFor", text: "Pipelines" },
      { action: "verify", selector: "button", contains: "View →" },
      { action: "click", selector: "button:first-of-type" }, // Click first pipeline
      { action: "waitFor", text: "Pipeline Stages" },
    ],
  },

  /**
   * Test 3: Cursor pointer on clickable elements
   */
  cursorPointerValidation: {
    description: "Verify cursor-pointer class on clickable elements",
    steps: [
      { action: "navigate", url: `${BASE_URL}/pipelines` },
      { action: "verifyStyle", selector: "button", style: "cursor", value: "pointer" },
    ],
  },

  /**
   * Test 4: Running executions page
   */
  runningExecutionsPage: {
    description: "Running executions page shows history with pagination",
    steps: [
      { action: "navigate", url: `${BASE_URL}/running` },
      { action: "waitFor", text: "Running" },
      { action: "verify", selector: "section", exists: true },
    ],
  },

  /**
   * Test 5: Pipeline detail with recent executions
   */
  pipelineDetailWithHistory: {
    description: "Pipeline detail page shows recent executions section",
    steps: [
      { action: "navigate", url: `${BASE_URL}/pipelines/prompt-optimizer-v1` },
      { action: "waitFor", text: "Prompt Processing Pipeline" },
      { action: "verify", text: "Pipeline Stages", exists: true },
      // Recent Executions section appears if there are executions
    ],
  },

  /**
   * Test 6: Navigation via sidebar
   */
  sidebarNavigation: {
    description: "Sidebar navigation works correctly",
    steps: [
      { action: "navigate", url: `${BASE_URL}/` },
      { action: "click", text: "Pipelines" },
      { action: "waitFor", url: "/pipelines" },
      { action: "click", text: "Outputs" },
      { action: "waitFor", url: "/outputs" },
      { action: "click", text: "Running" },
      { action: "waitFor", url: "/running" },
    ],
  },

  /**
   * Test 7: Execution form validation
   */
  executionFormValidation: {
    description: "Execution form validates input before running",
    steps: [
      { action: "navigate", url: `${BASE_URL}/pipelines/prompt-optimizer-v1` },
      { action: "waitFor", text: "Run Pipeline" },
      { action: "verify", selector: "button[disabled]", contains: "Run Pipeline" }, // Disabled without input
      { action: "type", selector: "textarea", text: "Test prompt" },
      { action: "verify", selector: "button:not([disabled])", contains: "Run Pipeline" }, // Enabled with input
    ],
  },

  /**
   * Test 8: History card click navigation
   */
  historyCardNavigation: {
    description: "Clicking history card navigates to execution detail",
    steps: [
      { action: "navigate", url: `${BASE_URL}/running` },
      { action: "waitFor", text: "Previous Executions" },
      { action: "click", selector: ".cursor-pointer" }, // Click first history card
      { action: "waitFor", url: "/executions/" },
    ],
  },

  /**
   * Test 9: Stage accordion expand/collapse
   */
  stageAccordion: {
    description: "Pipeline stages can be expanded and collapsed",
    steps: [
      { action: "navigate", url: `${BASE_URL}/pipelines/prompt-optimizer-v1` },
      { action: "waitFor", text: "Pipeline Stages" },
      { action: "click", text: "Analyze" }, // Click first stage
      { action: "waitFor", text: "System Prompt" }, // Expanded content
      { action: "click", text: "Analyze" }, // Click to collapse
    ],
  },

  /**
   * Test 10: Back navigation works
   */
  backNavigation: {
    description: "Back buttons navigate correctly",
    steps: [
      { action: "navigate", url: `${BASE_URL}/pipelines/prompt-optimizer-v1` },
      { action: "waitFor", text: "← Back to Pipelines" },
      { action: "click", text: "← Back to Pipelines" },
      { action: "waitFor", url: "/pipelines" },
    ],
  },

  /**
   * Test 11: Copy button shows visual feedback
   */
  copyButtonFeedback: {
    description: "Copy button shows visual feedback when clicked",
    steps: [
      { action: "navigate", url: `${BASE_URL}/outputs` },
      { action: "waitFor", text: "Pipeline Outputs" },
      // Click first output to view details
      { action: "click", selector: ".cursor-pointer" },
      { action: "waitFor", text: "Final Output" },
      // Click copy button
      { action: "click", selector: ".copy-button, button:contains('Copy')" },
      // Verify feedback
      { action: "waitFor", text: "Copied!" },
      // Verify toast notification appears
      { action: "verify", selector: ".copy-toast", exists: true },
    ],
  },

  /**
   * Test 12: Copy button on execution detail page
   */
  copyButtonExecutionDetail: {
    description: "Copy button works on execution detail page",
    steps: [
      { action: "navigate", url: `${BASE_URL}/running` },
      { action: "waitFor", text: "Running" },
      // Click a completed execution to view
      { action: "click", selector: ".cursor-pointer" },
      { action: "waitFor", url: "/executions/" },
      // If there's a final output section, test copy
      { action: "verify", text: "Copy", exists: true },
    ],
  },

  /**
   * Test 13: Copy button resets state after delay
   */
  copyButtonReset: {
    description: "Copy button resets to initial state after 2 seconds",
    steps: [
      { action: "navigate", url: `${BASE_URL}/outputs` },
      { action: "waitFor", text: "Pipeline Outputs" },
      { action: "click", selector: ".cursor-pointer" },
      { action: "waitFor", text: "Final Output" },
      { action: "click", selector: ".copy-button, button:contains('Copy')" },
      { action: "waitFor", text: "Copied!" },
      // Wait for reset (2.5 seconds should be enough)
      { action: "wait", ms: 2500 },
      { action: "verify", text: "Copy", exists: true },
    ],
  },
};

// Simple validation tests that can run without browser
describe("Browser Test Scenarios", () => {
  test("All test scenarios are defined", () => {
    expect(Object.keys(browserTestScenarios).length).toBeGreaterThan(5);
  });

  test("Each scenario has description and steps", () => {
    for (const [name, scenario] of Object.entries(browserTestScenarios)) {
      expect(scenario.description).toBeTruthy();
      expect(Array.isArray(scenario.steps)).toBe(true);
      expect(scenario.steps.length).toBeGreaterThan(0);
    }
  });
});

// Export for use with Playwright MCP
export default browserTestScenarios;
