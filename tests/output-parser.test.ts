import { describe, it, expect } from "bun:test";
import { parseOutput } from "../src/core/output-parser.ts";

describe("parseOutput - JSON format", () => {
  it("should parse valid JSON", () => {
    const output = '{"key": "value", "number": 42}';
    const result = parseOutput(output, { format: "json", extract: [] });

    expect(result.format).toBe("json");
    expect(result.raw).toBe(output);
    expect(result.parsed.key).toBe("value");
    expect(result.parsed.number).toBe(42);
  });

  it("should extract JSON from code blocks", () => {
    const output = '```json\n{"key": "value"}\n```';
    const result = parseOutput(output, { format: "json", extract: [] });

    expect(result.parsed.key).toBe("value");
  });

  it("should extract JSON from markdown with text", () => {
    const output = 'Here is the result:\n{"key": "value"}\nDone.';
    const result = parseOutput(output, { format: "json", extract: [] });

    expect(result.parsed.key).toBe("value");
  });

  it("should extract fields using extract config", () => {
    const output = '{"nested": {"value": 123}, "other": "data"}';
    const result = parseOutput(output, {
      format: "json",
      extract: [
        { name: "extracted", path: "nested.value", required: true },
      ],
    });

    expect(result.parsed.extracted).toBe(123);
  });

  it("should throw for invalid JSON", () => {
    const output = 'not valid json';

    expect(() => {
      parseOutput(output, { format: "json", extract: [] });
    }).toThrow();
  });
});

describe("parseOutput - Markdown format", () => {
  it("should parse markdown sections", () => {
    const output = `# Summary
This is the summary.

# Details
These are the details.`;

    const result = parseOutput(output, { format: "markdown", extract: [] });

    expect(result.format).toBe("markdown");
    expect(result.parsed.summary).toBe("This is the summary.");
    expect(result.parsed.details).toBe("These are the details.");
  });

  it("should handle multiple header levels", () => {
    const output = `## Analysis
Some analysis content.

### Subsection
More content.`;

    const result = parseOutput(output, { format: "markdown", extract: [] });

    expect(result.parsed.analysis).toContain("Some analysis");
  });
});

describe("parseOutput - Text format", () => {
  it("should return content as-is", () => {
    const output = "Just some plain text content.";
    const result = parseOutput(output, { format: "text", extract: [] });

    expect(result.format).toBe("text");
    expect(result.parsed.content).toBe(output);
  });

  it("should extract labeled patterns", () => {
    const output = `Status: Complete
Result: Success
Notes: Everything worked fine.`;

    const result = parseOutput(output, { format: "text", extract: [] });

    expect(result.parsed.status).toBe("Complete");
    expect(result.parsed.result).toBe("Success");
    expect(result.parsed.notes).toBe("Everything worked fine.");
  });

  it("should default to text format when not specified", () => {
    const output = "Default format test";
    const result = parseOutput(output);

    expect(result.format).toBe("text");
    expect(result.parsed.content).toBe(output);
  });
});

describe("parseOutput - Extract fields", () => {
  it("should use default value when field not found", () => {
    const output = '{"existing": "value"}';
    const result = parseOutput(output, {
      format: "json",
      extract: [
        { name: "missing", path: "not.there", required: false, default: "default_value" },
      ],
    });

    expect(result.parsed.missing).toBe("default_value");
  });

  it("should throw for missing required field", () => {
    const output = '{"existing": "value"}';

    expect(() => {
      parseOutput(output, {
        format: "json",
        extract: [
          { name: "required_field", path: "not.there", required: true },
        ],
      });
    }).toThrow();
  });

  it("should handle nested path extraction", () => {
    const output = '{"level1": {"level2": {"level3": "deep_value"}}}';
    const result = parseOutput(output, {
      format: "json",
      extract: [
        { name: "deep", path: "level1.level2.level3", required: true },
      ],
    });

    expect(result.parsed.deep).toBe("deep_value");
  });
});
