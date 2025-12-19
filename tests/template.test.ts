import { describe, it, expect } from "bun:test";
import {
  interpolateVariables,
  resolveVariable,
  buildPromptFromConfig,
} from "../src/utils/template.ts";
import type { TemplateContext } from "../src/utils/template.ts";
import type { StageResult } from "../src/typings/result.ts";

describe("interpolateVariables", () => {
  it("should replace simple variables", () => {
    const context: TemplateContext = {
      input: { prompt: "test prompt" },
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("Hello {{input_prompt}}", context);
    expect(result).toBe("Hello test prompt");
  });

  it("should replace multiple variables", () => {
    const context: TemplateContext = {
      input: { prompt: "test", value: "123" },
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("{{input_prompt}} - {{input_value}}", context);
    expect(result).toBe("test - 123");
  });

  it("should handle nested paths", () => {
    const context: TemplateContext = {
      input: { data: { nested: { value: "deep" } } },
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("Value: {{data.nested.value}}", context);
    expect(result).toBe("Value: deep");
  });

  it("should stringify objects", () => {
    const context: TemplateContext = {
      input: { obj: { a: 1, b: 2 } },
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("Data: {{obj}}", context);
    expect(result).toContain('"a": 1');
    expect(result).toContain('"b": 2');
  });

  it("should throw for undefined variables", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    expect(() => {
      interpolateVariables("{{undefined_var}}", context);
    }).toThrow();
  });

  it("should resolve stage outputs", () => {
    const stageResult: StageResult = {
      stageId: "stage-1",
      stageName: "Test",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { analysis: "completed" },
    };

    const context: TemplateContext = {
      input: {},
      stages: new Map([["stage-1", stageResult]]),
      context: {},
    };

    const result = interpolateVariables("Result: {{stage-1.analysis}}", context);
    expect(result).toBe("Result: completed");
  });
});

describe("resolveVariable", () => {
  it("should resolve input variable", () => {
    const context: TemplateContext = {
      input: { prompt: "test" },
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "input_prompt",
      source: "input" as const,
      path: "prompt",
      required: true,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBe("test");
  });

  it("should resolve static variable", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "static_var",
      source: "static" as const,
      value: "static value",
      required: true,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBe("static value");
  });

  it("should resolve context variable", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: { key: "context value" },
    };

    const variable = {
      name: "ctx",
      source: "context" as const,
      path: "key",
      required: true,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBe("context value");
  });

  it("should throw for previousStage without stageId", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "prev",
      source: "previousStage" as const,
      required: true,
    };

    expect(() => resolveVariable(variable, context)).toThrow();
  });
});

describe("buildPromptFromConfig", () => {
  it("should build prompt from variables and template", () => {
    const context: TemplateContext = {
      input: { prompt: "user input" },
      stages: new Map(),
      context: {},
    };

    const variables = [
      {
        name: "input_prompt",
        source: "input" as const,
        path: "prompt",
        required: true,
      },
    ];

    const result = buildPromptFromConfig(
      "Process: {{input_prompt}}",
      variables,
      context
    );

    expect(result).toBe("Process: user input");
  });

  it("should handle missing optional variables", () => {
    const context: TemplateContext = {
      input: { prompt: "test" },
      stages: new Map(),
      context: {},
    };

    const variables = [
      {
        name: "input_prompt",
        source: "input" as const,
        path: "prompt",
        required: true,
      },
      {
        name: "optional",
        source: "input" as const,
        path: "optional",
        required: false,
      },
    ];

    // This should work because the optional variable isn't used in the template
    const result = buildPromptFromConfig(
      "Process: {{input_prompt}}",
      variables,
      context
    );

    expect(result).toBe("Process: test");
  });

  it("should throw for missing required variables", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variables = [
      {
        name: "required_var",
        source: "input" as const,
        path: "missing",
        required: true,
      },
    ];

    expect(() => {
      buildPromptFromConfig("{{required_var}}", variables, context);
    }).toThrow();
  });
});
