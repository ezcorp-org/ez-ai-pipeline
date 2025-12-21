import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { spawn } from "bun";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const CLI_PATH = path.join(import.meta.dir, "../dist/index.js");
const TEST_PIPELINES_DIR = path.join(import.meta.dir, "../pipelines");

async function runCLI(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = spawn({
    cmd: ["node", CLI_PATH, ...args],
    cwd: path.join(import.meta.dir, ".."),
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  return { stdout, stderr, exitCode };
}

describe("CLI E2E Tests", () => {
  describe("--help", () => {
    it("should display help information", async () => {
      const { stdout, exitCode } = await runCLI(["--help"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("ez-ai-pipeline");
      expect(stdout).toContain("Commands:");
      expect(stdout).toContain("run");
      expect(stdout).toContain("list");
      expect(stdout).toContain("validate");
      expect(stdout).toContain("init");
    });
  });

  describe("--version", () => {
    it("should display version number", async () => {
      const { stdout, exitCode } = await runCLI(["--version"]);

      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe("list command", () => {
    it("should list available pipelines", async () => {
      const { stdout, exitCode } = await runCLI(["list"]);

      expect(exitCode).toBe(0);
      // Should show header or pipelines if any exist
      expect(stdout).toBeDefined();
    });

    it("should support --json flag", async () => {
      const { stdout, exitCode } = await runCLI(["list", "--json"]);

      expect(exitCode).toBe(0);
      // Output should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
    });
  });

  describe("validate command", () => {
    it("should validate a valid pipeline", async () => {
      // Check if there's a pipeline to validate
      const files = await fs.readdir(TEST_PIPELINES_DIR).catch(() => []);
      const pipelineFile = files.find(f => f.endsWith(".ts") && !f.startsWith("_"));

      if (!pipelineFile) {
        console.log("Skipping: no pipeline files found");
        return;
      }

      const pipelineId = pipelineFile.replace(".ts", "");
      const { stdout, exitCode } = await runCLI(["validate", "-p", pipelineId]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("valid");
    });

    it("should fail for non-existent pipeline", async () => {
      const { exitCode } = await runCLI(["validate", "-p", "non-existent-pipeline-12345"]);

      expect(exitCode).toBe(1);
    });
  });

  describe("init command", () => {
    const testPipelineName = `test-pipeline-${Date.now()}`;
    const testPipelinePath = path.join(TEST_PIPELINES_DIR, `${testPipelineName}.ts`);

    afterAll(async () => {
      // Cleanup test pipeline
      await fs.unlink(testPipelinePath).catch(() => {});
    });

    it("should create a new pipeline from template", async () => {
      const { stdout, exitCode } = await runCLI(["init", testPipelineName]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("Created new pipeline");

      // Verify file was created
      const fileExists = await fs.access(testPipelinePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);

      // Verify file content
      const content = await fs.readFile(testPipelinePath, "utf-8");
      expect(content).toContain("PipelineConfig");
      expect(content).toContain(testPipelineName);
    });

    it("should fail if pipeline already exists", async () => {
      // Try to create the same pipeline again
      const { exitCode, stdout } = await runCLI(["init", testPipelineName]);

      expect(exitCode).toBe(1);
      expect(stdout).toContain("already exists");
    });
  });

  describe("run command", () => {
    it("should require pipeline or show interactive mode", async () => {
      // Without -p flag, it should try interactive mode (which will fail in non-TTY)
      const { exitCode } = await runCLI(["run", "-p", "non-existent"]);

      // Should fail because pipeline doesn't exist
      expect(exitCode).toBe(1);
    });

    it("should show help with --help flag", async () => {
      const { stdout, exitCode } = await runCLI(["run", "--help"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("--pipeline");
      expect(stdout).toContain("--input");
      expect(stdout).toContain("--output");
    });
  });
});

describe("Node.js Compatibility", () => {
  it("should run with Node.js runtime", async () => {
    const proc = spawn({
      cmd: ["node", "--version"],
      stdout: "pipe",
    });

    const nodeVersion = await new Response(proc.stdout).text();
    expect(nodeVersion).toMatch(/^v\d+\.\d+\.\d+/);

    // Verify CLI works with node
    const { exitCode } = await runCLI(["--version"]);
    expect(exitCode).toBe(0);
  });

  it("should have correct shebang", async () => {
    const content = await fs.readFile(CLI_PATH, "utf-8");
    expect(content.startsWith("#!/usr/bin/env node")).toBe(true);
  });
});
