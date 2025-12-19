import type { OutputConfig } from "@typings/stage.ts";
import { PipelineError } from "@utils/errors.ts";

export interface ParsedOutput {
  raw: string;
  parsed: Record<string, unknown>;
  format: "json" | "text" | "markdown";
}

export function parseOutput(
  rawOutput: string,
  config?: OutputConfig
): ParsedOutput {
  const format = config?.format || "text";

  switch (format) {
    case "json":
      return parseJsonOutput(rawOutput, config);
    case "markdown":
      return parseMarkdownOutput(rawOutput, config);
    case "text":
    default:
      return parseTextOutput(rawOutput, config);
  }
}

function parseJsonOutput(
  rawOutput: string,
  config?: OutputConfig
): ParsedOutput {
  // Try to extract JSON from the output
  let jsonStr = rawOutput;

  // Handle code blocks
  const codeBlockMatch = rawOutput.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch?.[1]) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Try to find JSON object or array
  const jsonMatch = jsonStr.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch?.[1]) {
    jsonStr = jsonMatch[1];
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const extracted = extractFields(parsed, config?.extract);

    return {
      raw: rawOutput,
      parsed: extracted,
      format: "json",
    };
  } catch (error) {
    throw new PipelineError(
      `Failed to parse JSON output: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function parseMarkdownOutput(
  rawOutput: string,
  config?: OutputConfig
): ParsedOutput {
  // Extract sections from markdown
  const sections: Record<string, string> = {};
  const lines = rawOutput.split("\n");
  let currentSection = "content";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^#+\s+(.+)$/);
    if (headerMatch?.[1]) {
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join("\n").trim();
      }
      currentSection = headerMatch[1].toLowerCase().replace(/\s+/g, "_");
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Save the last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  const extracted = extractFields(sections, config?.extract);

  return {
    raw: rawOutput,
    parsed: { ...sections, ...extracted },
    format: "markdown",
  };
}

function parseTextOutput(
  rawOutput: string,
  config?: OutputConfig
): ParsedOutput {
  // For text output, try to extract key-value patterns
  const patterns: Record<string, unknown> = {
    content: rawOutput,
  };

  // Try to extract labeled sections
  const labelPattern = /^([A-Z][A-Za-z_]+):\s*(.+)$/gm;
  let match;

  while ((match = labelPattern.exec(rawOutput)) !== null) {
    const key = match[1]?.toLowerCase();
    const value = match[2]?.trim();
    if (key && value) {
      patterns[key] = value;
    }
  }

  const extracted = extractFields(patterns, config?.extract);

  return {
    raw: rawOutput,
    parsed: { ...patterns, ...extracted },
    format: "text",
  };
}

function extractFields(
  data: Record<string, unknown>,
  extractConfig?: OutputConfig["extract"]
): Record<string, unknown> {
  if (!extractConfig || extractConfig.length === 0) {
    return data;
  }

  const extracted: Record<string, unknown> = {};

  for (const field of extractConfig) {
    const value = getValueByPath(data, field.path);

    if (value !== undefined) {
      extracted[field.name] = value;
    } else if (field.default !== undefined) {
      extracted[field.name] = field.default;
    } else if (field.required) {
      throw new PipelineError(
        `Required field "${field.name}" not found at path "${field.path}"`
      );
    }
  }

  return extracted;
}

function getValueByPath(data: unknown, path: string): unknown {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  const parts = path.split(".");
  let current: unknown = data;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}
