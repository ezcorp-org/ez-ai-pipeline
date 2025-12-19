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

  it("should stringify object values in template", () => {
    const context: TemplateContext = {
      input: { prompt: "test" },
      stages: new Map(),
      context: {},
    };

    const variables = [
      {
        name: "data",
        source: "static" as const,
        value: { key: "value", nested: { data: 123 } },
        required: true,
      },
    ];

    const result = buildPromptFromConfig("Data: {{data}}", variables, context);

    expect(result).toContain('"key": "value"');
    expect(result).toContain('"nested"');
  });

  it("should handle undefined optional variables as empty string", () => {
    const context: TemplateContext = {
      input: { prompt: "test" },
      stages: new Map(),
      context: {},
    };

    const variables = [
      {
        name: "optional",
        source: "input" as const,
        path: "missing",
        required: false,
      },
    ];

    const result = buildPromptFromConfig("Value: {{optional}}", variables, context);

    expect(result).toBe("Value: ");
  });

  it("should throw for undefined variables in template not in variables list", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variables: any[] = [];

    expect(() => {
      buildPromptFromConfig("{{missing_var}}", variables, context);
    }).toThrow();
  });

  it("should resolve variables from context fallback", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: { fallbackValue: "from context" },
    };

    const result = buildPromptFromConfig("{{fallbackValue}}", [], context);

    expect(result).toBe("from context");
  });
});

describe("resolveVariable edge cases", () => {
  it("should throw for previousStage without required stageId", () => {
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

    expect(() => resolveVariable(variable, context)).toThrow("requires stageId");
  });

  it("should return undefined for non-required missing stage", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "prev",
      source: "previousStage" as const,
      stageId: "missing-stage",
      required: false,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBeUndefined();
  });

  it("should throw for required missing stage", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "prev",
      source: "previousStage" as const,
      stageId: "missing-stage",
      required: true,
    };

    expect(() => resolveVariable(variable, context)).toThrow("not found");
  });

  it("should resolve previousStage with path", () => {
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
      parsedOutput: { data: { nested: { value: "deep value" } } },
    };

    const context: TemplateContext = {
      input: {},
      stages: new Map([["stage-1", stageResult]]),
      context: {},
    };

    const variable = {
      name: "prev",
      source: "previousStage" as const,
      stageId: "stage-1",
      path: "data.nested.value",
      required: true,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBe("deep value");
  });

  it("should throw for unknown variable source", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "test",
      source: "unknown" as any,
      required: true,
    };

    expect(() => resolveVariable(variable, context)).toThrow("Unknown variable source");
  });

  it("should resolve input variable without path using name", () => {
    const context: TemplateContext = {
      input: { prompt: "test prompt" },
      stages: new Map(),
      context: {},
    };

    const variable = {
      name: "prompt",
      source: "input" as const,
      required: true,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBe("test prompt");
  });

  it("should resolve context variable without path using name", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: { userId: "123" },
    };

    const variable = {
      name: "userId",
      source: "context" as const,
      required: true,
    };

    const result = resolveVariable(variable, context);
    expect(result).toBe("123");
  });
});

describe("interpolateVariables edge cases", () => {
  it("should handle template with no variables", () => {
    const context: TemplateContext = {
      input: {},
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("No variables here", context);
    expect(result).toBe("No variables here");
  });

  it("should handle input.prompt notation", () => {
    const context: TemplateContext = {
      input: { prompt: "test prompt" },
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("{{input.prompt}}", context);
    expect(result).toBe("test prompt");
  });

  it("should handle whitespace in variable paths", () => {
    const context: TemplateContext = {
      input: { prompt: "test" },
      stages: new Map(),
      context: {},
    };

    const result = interpolateVariables("{{  input_prompt  }}", context);
    expect(result).toBe("test");
  });

  it("should resolve stage output from dot notation", () => {
    const stageResult: StageResult = {
      stageId: "stage-1",
      stageName: "Test",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: { text: "raw output text" },
      parsedOutput: { result: "parsed result" },
    };

    const context: TemplateContext = {
      input: {},
      stages: new Map([["stage-1", stageResult]]),
      context: {},
    };

    const result = interpolateVariables("{{stage-1.result}}", context);
    expect(result).toBe("parsed result");
  });

  it("should handle deeply nested paths with intermediate non-objects", () => {
    const context: TemplateContext = {
      input: { data: { value: "string", nested: "not an object" } },
      stages: new Map(),
      context: {},
    };

    // Try to access nested.deep.value where nested is a string
    expect(() => {
      interpolateVariables("{{data.nested.deep}}", context);
    }).toThrow();
  });
});
