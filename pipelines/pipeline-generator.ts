import type { PipelineConfig } from "../src/typings/pipeline.ts";

/**
 * Pipeline Generator - A Meta-Pipeline for Creating Pipelines
 *
 * This pipeline takes a description of what pipeline you want to create
 * and generates a complete, valid pipeline configuration.
 *
 * Input: { prompt: "description of the pipeline you want to create" }
 * Output: Complete PipelineConfig JSON that can be saved as a new pipeline file
 *
 * Stages:
 * 1. Analyze Requirements - Understand what the user wants to build
 * 2. Design Architecture - Plan stages, models, and data flow
 * 3. Generate Pipeline - Create the actual pipeline configuration
 * 4. Validate Configuration - Ensure the pipeline is valid and complete
 * 5. Refine Pipeline - Fix any issues found during validation
 * 6. Finalize - Output the ready-to-use pipeline
 */

// Schema reference is passed as a static variable to avoid template parsing issues
const PIPELINE_SCHEMA_REFERENCE = `## Pipeline Configuration Schema Reference

### Pipeline Object Structure:
\`\`\`json
{
  "pipeline": {
    "id": "string (kebab-case, e.g., 'my-pipeline-v1')",
    "name": "string (human-readable name)",
    "version": "string (semver, e.g., '1.0.0')",
    "description": "string (optional)",
    "defaultProvider": "anthropic" | "openai" | "google",
    "targetModel": ModelConfig (optional),
    "settings": {
      "enableCaching": true,
      "enableEarlyExit": true,
      "maxRetries": 2,
      "timeoutMs": 300000,
      "parallelExecution": false
    }
  },
  "stages": [Stage, Stage, ...]
}
\`\`\`

### Stage Object:
\`\`\`json
{
  "id": "stage-1-analyze",
  "name": "Analyze Input",
  "type": "analyze",
  "description": "optional description",
  "model": ModelConfig,
  "prompt": PromptConfig,
  "output": OutputConfig,
  "conditions": Conditions,
  "retryCount": 2,
  "timeoutMs": 60000
}
\`\`\`
Stage types: "analyze", "structure", "enhance", "validate", "test", "iterate", "custom"

### ModelConfig:
\`\`\`json
{
  "providerID": "anthropic",
  "modelID": "claude-sonnet-4-5-20250929",
  "tier": "medium",
  "maxTokens": 4096,
  "temperature": 0.5
}
\`\`\`
Models: claude-haiku-4-5-20251001 (small), claude-sonnet-4-5-20250929 (medium), claude-opus-4-5-20250929 (large), gpt-4o, gpt-4o-mini, gemini-1.5-pro, gemini-2.0-flash

### PromptConfig:
\`\`\`json
{
  "systemPrompt": "You are an expert...",
  "template": "Analyze this: \\u007b\\u007binput_prompt\\u007d\\u007d and previous: \\u007b\\u007bstage-1-analyze.result\\u007d\\u007d",
  "variables": [
    { "name": "input_prompt", "source": "input", "path": "prompt", "required": true },
    { "name": "stage-1-analyze.result", "source": "previousStage", "stageId": "stage-1-analyze", "path": "result", "required": true }
  ]
}
\`\`\`
IMPORTANT: Use double curly braces for variables in templates. Format: \\u007b\\u007bvariableName\\u007d\\u007d
Variable sources: "input" (user input), "previousStage" (requires stageId), "context", "static" (requires value)

### OutputConfig:
\`\`\`json
{
  "format": "json",
  "extract": [
    { "name": "fieldName", "path": "response.field", "required": true },
    { "name": "optional", "path": "other.field", "required": false, "default": null }
  ]
}
\`\`\`
Formats: "json", "text", "markdown"

### Conditions:
\`\`\`json
{
  "skipIf": { "condition": { "path": "isComplete", "equals": true }, "sourceStage": "stage-1-analyze" },
  "runIf": { "condition": { "path": "needsWork", "equals": true }, "sourceStage": "stage-1-analyze" },
  "earlyExit": { "condition": { "path": "done", "equals": true }, "returnStage": "stage-2-process" }
}
\`\`\`
Condition operators: equals, notEquals, contains, greaterThan, lessThan, exists

## Best Practices:
1. Use Haiku for fast analysis, Sonnet for generation, Opus for complex reasoning
2. Temperature: 0.1-0.3 for analysis, 0.5-0.7 for generation
3. Always include systemPrompt to set the AI role
4. Use JSON format with extract config for structured outputs
5. Chain stages using previousStage variables with stageId
6. Always instruct model to return ONLY valid JSON when format is json
7. Variable names in template must exactly match names in variables array
8. previousStage variables MUST have stageId pointing to an earlier stage`;

const config: PipelineConfig = {
  pipeline: {
    id: "pipeline-generator-v1",
    name: "Pipeline Generator",
    version: "1.0.0",
    description:
      "Meta-pipeline that generates new pipeline configurations from natural language descriptions",
    defaultProvider: "anthropic",
    targetModel: {
      providerID: "anthropic",
      modelID: "claude-sonnet-4-5-20250929",
      tier: "medium",
      maxTokens: 8192,
      temperature: 0.5,
    },
    settings: {
      enableCaching: true,
      enableEarlyExit: true,
      maxRetries: 2,
      timeoutMs: 600000, // 10 minutes for complex generation
      parallelExecution: false,
    },
  },
  stages: [
    // Stage 1: Analyze Requirements
    {
      id: "stage-1-analyze",
      name: "Analyze Requirements",
      type: "analyze",
      description:
        "Parse the user's description to understand pipeline requirements, goals, and constraints",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 4096,
        temperature: 0.3,
      },
      prompt: {
        systemPrompt: `You are an expert pipeline architect. Your job is to analyze requests for AI pipelines and extract structured requirements. Think deeply about what the user is trying to accomplish and what stages would be needed.

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text or explanation.`,
        template: `Analyze the following pipeline request and extract structured requirements.

User's Pipeline Request:
"""
{{input_prompt}}
"""

Analyze this request and determine:
1. What is the primary goal/purpose of this pipeline?
2. What are the inputs the pipeline will receive?
3. What outputs should the pipeline produce?
4. What processing stages are needed (minimum 2, maximum 8)?
5. Are there any special requirements (validation, iteration, early exit conditions)?
6. What AI model tiers are appropriate for each stage?
7. What is the expected complexity level?

Respond with ONLY this JSON object (no other text):
{
  "purpose": "clear description of pipeline's primary goal",
  "inputSchema": {
    "fields": [
      { "name": "fieldName", "type": "string|number|boolean|object|array", "description": "what this field contains", "required": true }
    ]
  },
  "outputSchema": {
    "fields": [
      { "name": "fieldName", "type": "string|number|boolean|object|array", "description": "what this output contains" }
    ]
  },
  "suggestedStages": [
    {
      "order": 1,
      "name": "Stage Name",
      "type": "analyze|structure|enhance|validate|test|iterate|custom",
      "purpose": "what this stage does",
      "modelTier": "small|medium|large",
      "temperature": 0.3,
      "hasConditions": false,
      "conditionType": null
    }
  ],
  "specialRequirements": {
    "needsValidation": true,
    "needsIteration": false,
    "needsEarlyExit": false,
    "earlyExitCondition": null
  },
  "complexity": "simple|moderate|complex",
  "estimatedStageCount": 4,
  "notes": "any additional considerations or recommendations"
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "purpose", path: "purpose", required: true },
          { name: "inputSchema", path: "inputSchema", required: true },
          { name: "outputSchema", path: "outputSchema", required: true },
          { name: "suggestedStages", path: "suggestedStages", required: true },
          {
            name: "specialRequirements",
            path: "specialRequirements",
            required: true,
          },
          { name: "complexity", path: "complexity", required: true },
          {
            name: "estimatedStageCount",
            path: "estimatedStageCount",
            required: true,
          },
          { name: "notes", path: "notes", required: false },
        ],
      },
      retryCount: 2,
      timeoutMs: 60000,
    },

    // Stage 2: Design Architecture
    {
      id: "stage-2-design",
      name: "Design Architecture",
      type: "structure",
      description:
        "Design the detailed pipeline architecture including data flow between stages",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 6144,
        temperature: 0.4,
      },
      prompt: {
        systemPrompt: `You are a senior pipeline architect. Design detailed pipeline architectures with proper data flow, variable chaining, and conditional logic. Your designs should be practical, efficient, and follow best practices.

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text or explanation.`,
        template: `Design a detailed pipeline architecture based on the analyzed requirements.

Pipeline Purpose: {{stage-1-analyze.purpose}}
Complexity: {{stage-1-analyze.complexity}}
Suggested Stages: {{stage-1-analyze.suggestedStages}}
Special Requirements: {{stage-1-analyze.specialRequirements}}
Input Schema: {{stage-1-analyze.inputSchema}}
Output Schema: {{stage-1-analyze.outputSchema}}

Original Request:
"""
{{input_prompt}}
"""

Design the complete pipeline architecture with:
1. Detailed stage definitions with clear responsibilities
2. Data flow showing how outputs chain to inputs
3. Appropriate model selection for each stage
4. Conditional logic where needed
5. Variable mappings between stages

{{schemaReference}}

Respond with ONLY this JSON object (no other text):
{
  "pipelineMetadata": {
    "id": "kebab-case-pipeline-id-v1",
    "name": "Human Readable Pipeline Name",
    "version": "1.0.0",
    "description": "Clear description of what this pipeline does",
    "defaultProvider": "anthropic"
  },
  "stages": [
    {
      "id": "stage-1-name",
      "name": "Stage Display Name",
      "type": "analyze|structure|enhance|validate|test|iterate|custom",
      "purpose": "detailed description of stage purpose",
      "modelConfig": {
        "provider": "anthropic",
        "model": "claude-haiku-4-5-20251001|claude-sonnet-4-5-20250929|claude-opus-4-5-20250929",
        "tier": "small|medium|large",
        "maxTokens": 2048,
        "temperature": 0.3
      },
      "inputVariables": [
        { "name": "varName", "source": "input|previousStage|context|static", "path": "field.path", "stageId": "previous-stage-id" }
      ],
      "outputFields": [
        { "name": "fieldName", "path": "response.path", "required": true }
      ],
      "conditions": {
        "skipIf": null,
        "runIf": null,
        "earlyExit": null
      },
      "systemPromptGuidance": "brief description of what the system prompt should establish",
      "promptTemplateGuidance": "brief description of what the prompt template should request"
    }
  ],
  "dataFlow": [
    { "from": "input", "to": "stage-1-name", "fields": ["prompt"] },
    { "from": "stage-1-name", "to": "stage-2-name", "fields": ["fieldName"] }
  ],
  "settings": {
    "enableCaching": true,
    "enableEarlyExit": true,
    "maxRetries": 2,
    "timeoutMs": 300000
  }
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-1-analyze.purpose",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "purpose",
            required: true,
          },
          {
            name: "stage-1-analyze.complexity",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "complexity",
            required: true,
          },
          {
            name: "stage-1-analyze.suggestedStages",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "suggestedStages",
            required: true,
          },
          {
            name: "stage-1-analyze.specialRequirements",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "specialRequirements",
            required: true,
          },
          {
            name: "stage-1-analyze.inputSchema",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "inputSchema",
            required: true,
          },
          {
            name: "stage-1-analyze.outputSchema",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "outputSchema",
            required: true,
          },
          {
            name: "schemaReference",
            source: "static",
            value: PIPELINE_SCHEMA_REFERENCE,
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          {
            name: "pipelineMetadata",
            path: "pipelineMetadata",
            required: true,
          },
          { name: "stages", path: "stages", required: true },
          { name: "dataFlow", path: "dataFlow", required: true },
          { name: "settings", path: "settings", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 90000,
    },

    // Stage 3: Generate Pipeline Configuration
    {
      id: "stage-3-generate",
      name: "Generate Pipeline",
      type: "custom",
      description:
        "Generate the complete, valid PipelineConfig TypeScript code",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 32768,
        temperature: 0.3,
      },
      prompt: {
        systemPrompt: `You are an expert TypeScript developer specializing in pipeline configuration. Generate complete, valid, production-ready pipeline configurations.

CRITICAL: You MUST respond with ONLY a valid, complete JSON object. No markdown, no code blocks, no explanation. Just pure JSON that starts with { and ends with }.`,
        template: `Generate a complete PipelineConfig JSON based on this architecture:

Pipeline: {{stage-2-design.pipelineMetadata}}
Designed Stages: {{stage-2-design.stages}}
Settings: {{stage-2-design.settings}}

{{schemaReference}}

INSTRUCTIONS:
1. Create the full pipeline config with "pipeline" and "stages" objects
2. For each stage, write complete systemPrompt and template strings
3. Use double curly braces for template variables (e.g., the characters { { variableName } } without spaces)
4. All previousStage variables need stageId set
5. Keep prompts concise but complete
6. Use format: "json" for all outputs with proper extract configs

Respond with ONLY valid JSON in this exact structure:
{"pipelineConfig":{"pipeline":{...},"stages":[...]},"generationNotes":"..."}`,
        variables: [
          {
            name: "stage-2-design.pipelineMetadata",
            source: "previousStage",
            stageId: "stage-2-design",
            path: "pipelineMetadata",
            required: true,
          },
          {
            name: "stage-2-design.stages",
            source: "previousStage",
            stageId: "stage-2-design",
            path: "stages",
            required: true,
          },
          {
            name: "stage-2-design.settings",
            source: "previousStage",
            stageId: "stage-2-design",
            path: "settings",
            required: true,
          },
          {
            name: "schemaReference",
            source: "static",
            value: PIPELINE_SCHEMA_REFERENCE,
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "pipelineConfig", path: "pipelineConfig", required: true },
          {
            name: "generationNotes",
            path: "generationNotes",
            required: false,
          },
        ],
      },
      retryCount: 3,
      timeoutMs: 180000,
    },

    // Stage 4: Validate Configuration
    {
      id: "stage-4-validate",
      name: "Validate Configuration",
      type: "validate",
      description:
        "Validate the generated pipeline configuration for correctness and completeness",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 4096,
        temperature: 0.1,
      },
      prompt: {
        systemPrompt: `You are a pipeline configuration validator. Check configurations for schema compliance, logical correctness, and best practices. Be thorough and identify all issues.

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text or explanation.`,
        template: `Validate the following generated pipeline configuration.

Generated Pipeline:
{{stage-3-generate.pipelineConfig}}

Original Request:
"""
{{input_prompt}}
"""

Validate against these criteria:

1. SCHEMA COMPLIANCE:
   - pipeline.id is kebab-case
   - pipeline.version is semver (x.y.z)
   - All stages have unique ids
   - All stage types are valid
   - Model configs have valid providerID and modelID
   - Temperature is 0-2, maxTokens is positive

2. VARIABLE CORRECTNESS:
   - All template variables have matching entries in variables array
   - previousStage variables have stageId set
   - stageIds reference existing stages
   - No circular dependencies

3. DATA FLOW:
   - Stages can access data from previous stages (not future)
   - Required variables are properly chained
   - Output extracts match what prompts ask for

4. LOGICAL CORRECTNESS:
   - Conditions reference valid stages and paths
   - earlyExit returnStage exists
   - Stage order makes sense for the purpose

5. BEST PRACTICES:
   - Prompts instruct JSON output when format is json
   - Appropriate model tiers for stage complexity
   - Reasonable timeouts and retry counts

Respond with ONLY this JSON object (no other text):
{
  "isValid": true,
  "schemaCompliance": {
    "passed": true,
    "issues": []
  },
  "variableCorrectness": {
    "passed": true,
    "issues": []
  },
  "dataFlow": {
    "passed": true,
    "issues": []
  },
  "logicalCorrectness": {
    "passed": true,
    "issues": []
  },
  "bestPractices": {
    "passed": true,
    "suggestions": []
  },
  "criticalIssues": [],
  "warnings": [],
  "suggestions": [],
  "overallScore": 95,
  "readyForUse": true
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-3-generate.pipelineConfig",
            source: "previousStage",
            stageId: "stage-3-generate",
            path: "pipelineConfig",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "isValid", path: "isValid", required: true },
          { name: "criticalIssues", path: "criticalIssues", required: true },
          { name: "warnings", path: "warnings", required: true },
          { name: "suggestions", path: "suggestions", required: false },
          { name: "overallScore", path: "overallScore", required: true },
          { name: "readyForUse", path: "readyForUse", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 60000,
    },

    // Stage 5: Refine Pipeline (if needed)
    {
      id: "stage-5-refine",
      name: "Refine Pipeline",
      type: "iterate",
      description:
        "Fix any issues found during validation and apply improvements",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 16384,
        temperature: 0.3,
      },
      prompt: {
        systemPrompt: `You are an expert pipeline engineer fixing and refining pipeline configurations. Address all issues while preserving the original intent and functionality.

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text or explanation.`,
        template: `Refine the pipeline configuration to fix validation issues.

Current Pipeline Configuration:
{{stage-3-generate.pipelineConfig}}

Validation Results:
- Is Valid: {{stage-4-validate.isValid}}
- Critical Issues: {{stage-4-validate.criticalIssues}}
- Warnings: {{stage-4-validate.warnings}}
- Suggestions: {{stage-4-validate.suggestions}}
- Score: {{stage-4-validate.overallScore}}

Original Request:
"""
{{input_prompt}}
"""

Fix ALL critical issues and warnings. Apply suggestions where beneficial.
Ensure the refined pipeline:
1. Passes all schema compliance checks
2. Has correct variable references
3. Has proper data flow between stages
4. Follows best practices
5. Maintains the original purpose and functionality

Respond with ONLY this JSON object (no other text):
{
  "refinedPipelineConfig": {
    // Complete corrected PipelineConfig here
  },
  "fixesApplied": [
    { "issue": "what was wrong", "fix": "how it was fixed" }
  ],
  "improvementsApplied": ["list of improvements made"],
  "remainingConcerns": []
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-3-generate.pipelineConfig",
            source: "previousStage",
            stageId: "stage-3-generate",
            path: "pipelineConfig",
            required: true,
          },
          {
            name: "stage-4-validate.isValid",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "isValid",
            required: true,
          },
          {
            name: "stage-4-validate.criticalIssues",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "criticalIssues",
            required: true,
          },
          {
            name: "stage-4-validate.warnings",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "warnings",
            required: true,
          },
          {
            name: "stage-4-validate.suggestions",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "suggestions",
            required: false,
          },
          {
            name: "stage-4-validate.overallScore",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "overallScore",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          {
            name: "refinedPipelineConfig",
            path: "refinedPipelineConfig",
            required: true,
          },
          { name: "fixesApplied", path: "fixesApplied", required: true },
          {
            name: "improvementsApplied",
            path: "improvementsApplied",
            required: false,
          },
        ],
      },
      conditions: {
        skipIf: {
          condition: { path: "readyForUse", equals: true },
          sourceStage: "stage-4-validate",
        },
      },
      retryCount: 2,
      timeoutMs: 120000,
    },

    // Stage 6: Finalize Output
    {
      id: "stage-6-finalize",
      name: "Finalize Output",
      type: "custom",
      description:
        "Create the final pipeline output with usage instructions",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 4096,
        temperature: 0.2,
      },
      prompt: {
        systemPrompt: `You are a documentation expert. Create usage instructions for the generated pipeline.

IMPORTANT: You must respond with ONLY a valid JSON object, no additional text.`,
        template: `Create usage documentation for this pipeline.

Pipeline ID: {{stage-3-generate.pipelineConfig.pipeline.id}}
Validation Score: {{stage-4-validate.overallScore}}

Original Request:
"""
{{input_prompt}}
"""

Respond with ONLY this JSON:
{
  "filename": "kebab-case-filename.ts",
  "usage": {
    "command": "bun run src/index.ts run -p pipeline-name",
    "exampleInput": {"field": "example value"},
    "expectedOutput": "brief description"
  },
  "summary": {
    "stageCount": 5,
    "estimatedCost": "$0.05-0.15",
    "estimatedDuration": "30-60 seconds",
    "capabilities": ["capability1", "capability2"]
  }
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-3-generate.pipelineConfig.pipeline.id",
            source: "previousStage",
            stageId: "stage-3-generate",
            path: "pipelineConfig.pipeline.id",
            required: false,
          },
          {
            name: "stage-4-validate.overallScore",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "overallScore",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "filename", path: "filename", required: true },
          { name: "usage", path: "usage", required: true },
          { name: "summary", path: "summary", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 60000,
    },
  ],
};

export default config;
