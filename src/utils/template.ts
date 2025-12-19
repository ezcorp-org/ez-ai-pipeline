import type { Variable } from "@typings/stage.ts";
import type { StageResult } from "@typings/result.ts";
import { PipelineError } from "@utils/errors.ts";

export interface TemplateContext {
  input: Record<string, unknown>;
  stages: Map<string, StageResult>;
  context: Record<string, unknown>;
}

export function interpolateVariables(template: string, context: TemplateContext): string {
  const variablePattern = /\{\{([^}]+)\}\}/g;

  return template.replace(variablePattern, (_match, variablePath: string) => {
    const trimmedPath = variablePath.trim();
    const value = resolveVariablePath(trimmedPath, context);

    if (value === undefined) {
      throw new PipelineError(`Variable "${trimmedPath}" not found in context`);
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  });
}

export function resolveVariable(variable: Variable, context: TemplateContext): unknown {
  switch (variable.source) {
    case "input":
      return getValueByPath(context.input, variable.path || variable.name);

    case "previousStage":
      if (!variable.stageId) {
        throw new PipelineError(`Variable "${variable.name}" requires stageId for previousStage source`);
      }
      const stageResult = context.stages.get(variable.stageId);
      if (!stageResult) {
        if (variable.required) {
          throw new PipelineError(`Stage "${variable.stageId}" not found for variable "${variable.name}"`);
        }
        return undefined;
      }
      return getValueByPath(stageResult.parsedOutput || stageResult.output, variable.path);

    case "context":
      return getValueByPath(context.context, variable.path || variable.name);

    case "static":
      return variable.value;

    default:
      throw new PipelineError(`Unknown variable source: ${variable.source}`);
  }
}

function resolveVariablePath(path: string, context: TemplateContext): unknown {
  // Try input first (e.g., "input_prompt" -> input.prompt)
  if (path.startsWith("input_") || path.startsWith("input.")) {
    const inputPath = path.replace(/^input[_.]/, "");
    return getValueByPath(context.input, inputPath);
  }

  // Try stage outputs (e.g., "stage-1.overall")
  if (path.includes(".")) {
    const parts = path.split(".");
    const stageId = parts[0];
    const rest = parts.slice(1);
    if (stageId) {
      const stageResult = context.stages.get(stageId);
      if (stageResult) {
        return getValueByPath(stageResult.parsedOutput || stageResult.output, rest.join("."));
      }
    }
  }

  // Try direct input
  const inputValue = getValueByPath(context.input, path);
  if (inputValue !== undefined) {
    return inputValue;
  }

  // Try context
  return getValueByPath(context.context, path);
}

function getValueByPath(obj: unknown, path?: string): unknown {
  if (!path) return obj;
  if (typeof obj !== "object" || obj === null) return undefined;

  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

export function buildPromptFromConfig(
  template: string,
  variables: Variable[],
  context: TemplateContext
): string {
  // First, resolve all variables
  const resolvedVars: Record<string, unknown> = {};

  for (const variable of variables) {
    const value = resolveVariable(variable, context);
    if (value === undefined && variable.required) {
      throw new PipelineError(`Required variable "${variable.name}" not found`);
    }
    resolvedVars[variable.name] = value;
  }

  // Then interpolate the template
  const variablePattern = /\{\{([^}]+)\}\}/g;

  return template.replace(variablePattern, (_match, variablePath: string) => {
    const trimmedPath = variablePath.trim();

    // Check resolved variables first
    if (trimmedPath in resolvedVars) {
      const value = resolvedVars[trimmedPath];
      if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
      }
      return String(value ?? "");
    }

    // Fall back to context resolution
    const value = resolveVariablePath(trimmedPath, context);
    if (value === undefined) {
      throw new PipelineError(`Variable "${trimmedPath}" not found`);
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  });
}
