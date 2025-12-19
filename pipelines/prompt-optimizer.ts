import type { PipelineConfig } from "../src/typings/pipeline.ts";

const config: PipelineConfig = {
  pipeline: {
    id: "prompt-optimizer-v1",
    name: "Prompt Processing Pipeline",
    version: "1.0.0",
    description: "6-stage pipeline to analyze and optimize prompts for better AI responses",
    defaultProvider: "anthropic",
    targetModel: {
      providerID: "anthropic",
      modelID: "claude-sonnet-4-5-20250929",
      tier: "medium",
      maxTokens: 4096,
      temperature: 0.7,
    },
    settings: {
      enableCaching: true,
      enableEarlyExit: true,
      maxRetries: 2,
      timeoutMs: 300000,
      parallelExecution: false,
    },
  },
  stages: [
    // Stage 1: Analyze the prompt structure
    {
      id: "stage-1-analyze",
      name: "Analyze Prompt",
      type: "analyze",
      description: "Analyze the input prompt for structure, clarity, and completeness",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 1024,
        temperature: 0.1,
      },
      prompt: {
        systemPrompt: `You are an expert prompt analyst. Your job is to analyze prompts and identify what elements are present or missing.`,
        template: `Analyze the following prompt for these 5 key elements:

1. TASK: Is there a clear action/request? (YES/PARTIAL/NO)
2. CONTEXT: Is background information provided? (YES/PARTIAL/NO)
3. FORMAT: Is the desired output format specified? (YES/PARTIAL/NO)
4. CONSTRAINTS: Are there specific limitations or requirements? (YES/PARTIAL/NO)
5. AUDIENCE: Is the target audience defined? (YES/PARTIAL/NO)

Prompt to analyze:
"""
{{input_prompt}}
"""

Respond with a JSON object:
{
  "task": { "status": "YES|PARTIAL|NO", "details": "what was found or missing" },
  "context": { "status": "YES|PARTIAL|NO", "details": "what was found or missing" },
  "format": { "status": "YES|PARTIAL|NO", "details": "what was found or missing" },
  "constraints": { "status": "YES|PARTIAL|NO", "details": "what was found or missing" },
  "audience": { "status": "YES|PARTIAL|NO", "details": "what was found or missing" },
  "overall": "COMPLETE|NEEDS_WORK|MINIMAL",
  "missing": ["list of missing elements"]
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
          { name: "overall", path: "overall", required: true },
          { name: "missing", path: "missing", required: true },
          { name: "task", path: "task", required: true },
          { name: "context", path: "context", required: true },
          { name: "format", path: "format", required: true },
        ],
      },
      conditions: {
        earlyExit: {
          condition: { path: "overall", equals: "COMPLETE" },
          returnStage: "stage-1-analyze",
        },
      },
      retryCount: 2,
      timeoutMs: 30000,
    },

    // Stage 2: Structure the prompt
    {
      id: "stage-2-structure",
      name: "Structure Prompt",
      type: "structure",
      description: "Add structure and organization to the prompt",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 2048,
        temperature: 0.3,
      },
      prompt: {
        systemPrompt: `You are an expert prompt engineer. Your task is to restructure prompts into a clear, organized format while preserving the original intent.`,
        template: `Based on the analysis, restructure this prompt with clear sections.

Original prompt:
"""
{{input_prompt}}
"""

Analysis results:
- Missing elements: {{stage-1-analyze.missing}}
- Task status: {{stage-1-analyze.task}}
- Context status: {{stage-1-analyze.context}}

Create a structured version with labeled sections. Use XML-style tags for clarity.
Return as JSON:
{
  "structuredPrompt": "the restructured prompt with tags",
  "sectionsAdded": ["list of sections added"],
  "improvements": ["specific improvements made"]
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-1-analyze.missing",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "missing",
            required: true,
          },
          {
            name: "stage-1-analyze.task",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "task",
            required: true,
          },
          {
            name: "stage-1-analyze.context",
            source: "previousStage",
            stageId: "stage-1-analyze",
            path: "context",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "structuredPrompt", path: "structuredPrompt", required: true },
          { name: "sectionsAdded", path: "sectionsAdded", required: true },
        ],
      },
      conditions: {
        skipIf: {
          condition: { path: "overall", equals: "COMPLETE" },
          sourceStage: "stage-1-analyze",
        },
      },
      retryCount: 2,
      timeoutMs: 30000,
    },

    // Stage 3: Enhance with context
    {
      id: "stage-3-enhance",
      name: "Enhance Context",
      type: "enhance",
      description: "Add relevant context and background information",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 2048,
        temperature: 0.5,
      },
      prompt: {
        systemPrompt: `You are an expert at enhancing prompts with relevant context. Add helpful background information without changing the core request.`,
        template: `Enhance this structured prompt with additional context and clarity.

Structured prompt:
"""
{{stage-2-structure.structuredPrompt}}
"""

Original intent from:
"""
{{input_prompt}}
"""

Add:
1. Relevant context or background
2. Clearer instructions
3. Helpful constraints or guidelines

Return as JSON:
{
  "enhancedPrompt": "the enhanced prompt",
  "contextAdded": "description of context added",
  "clarifications": ["list of clarifications made"]
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-2-structure.structuredPrompt",
            source: "previousStage",
            stageId: "stage-2-structure",
            path: "structuredPrompt",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "enhancedPrompt", path: "enhancedPrompt", required: true },
          { name: "contextAdded", path: "contextAdded", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 45000,
    },

    // Stage 4: Validate the enhanced prompt
    {
      id: "stage-4-validate",
      name: "Validate Enhancement",
      type: "validate",
      description: "Validate that the enhanced prompt maintains the original intent",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 1024,
        temperature: 0.1,
      },
      prompt: {
        systemPrompt: `You are a quality assurance expert. Validate that enhanced prompts maintain the original intent while being improved.`,
        template: `Validate that the enhanced prompt maintains the original intent.

Original prompt:
"""
{{input_prompt}}
"""

Enhanced prompt:
"""
{{stage-3-enhance.enhancedPrompt}}
"""

Check:
1. Does it preserve the original intent?
2. Are the additions helpful and relevant?
3. Is the prompt clear and unambiguous?
4. Are there any issues or concerns?

Return as JSON:
{
  "intentPreserved": true/false,
  "additionsRelevant": true/false,
  "isClarity": true/false,
  "issues": ["any issues found"],
  "overallValid": true/false,
  "suggestions": ["any suggestions for improvement"]
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-3-enhance.enhancedPrompt",
            source: "previousStage",
            stageId: "stage-3-enhance",
            path: "enhancedPrompt",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "overallValid", path: "overallValid", required: true },
          { name: "issues", path: "issues", required: true },
          { name: "suggestions", path: "suggestions", required: false },
        ],
      },
      retryCount: 2,
      timeoutMs: 30000,
    },

    // Stage 5: Iterate if needed
    {
      id: "stage-5-iterate",
      name: "Iterate Improvements",
      type: "iterate",
      description: "Apply any final improvements based on validation feedback",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 2048,
        temperature: 0.4,
      },
      prompt: {
        systemPrompt: `You are an expert prompt engineer making final refinements. Apply suggested improvements while maintaining quality.`,
        template: `Apply final improvements to the prompt based on validation feedback.

Current enhanced prompt:
"""
{{stage-3-enhance.enhancedPrompt}}
"""

Validation issues: {{stage-4-validate.issues}}
Suggestions: {{stage-4-validate.suggestions}}

Apply the improvements and return the refined prompt.
Return as JSON:
{
  "refinedPrompt": "the refined prompt",
  "changesApplied": ["list of changes applied"],
  "finalNotes": "any notes about the refinement"
}`,
        variables: [
          {
            name: "stage-3-enhance.enhancedPrompt",
            source: "previousStage",
            stageId: "stage-3-enhance",
            path: "enhancedPrompt",
            required: true,
          },
          {
            name: "stage-4-validate.issues",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "issues",
            required: true,
          },
          {
            name: "stage-4-validate.suggestions",
            source: "previousStage",
            stageId: "stage-4-validate",
            path: "suggestions",
            required: false,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "refinedPrompt", path: "refinedPrompt", required: true },
          { name: "changesApplied", path: "changesApplied", required: true },
        ],
      },
      conditions: {
        skipIf: {
          condition: { path: "overallValid", equals: true },
          sourceStage: "stage-4-validate",
        },
      },
      retryCount: 2,
      timeoutMs: 45000,
    },

    // Stage 6: Finalize
    {
      id: "stage-6-finalize",
      name: "Finalize Output",
      type: "custom",
      description: "Create the final optimized prompt with metadata",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 2048,
        temperature: 0.2,
      },
      prompt: {
        systemPrompt: `You are a prompt engineer creating the final deliverable. Format the optimized prompt for production use.`,
        template: `Create the final optimized prompt ready for use.

Best available prompt:
"""
{{bestPrompt}}
"""

Original prompt for reference:
"""
{{input_prompt}}
"""

Format the final prompt with:
1. Clear structure with appropriate tags
2. All necessary context and instructions
3. Proper formatting for readability

Return as JSON:
{
  "optimizedPrompt": "the final optimized prompt",
  "summary": "brief summary of optimizations made",
  "improvementScore": 1-10,
  "usageNotes": "any notes for using this prompt"
}`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "bestPrompt",
            source: "context",
            path: "bestPrompt",
            required: false,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "optimizedPrompt", path: "optimizedPrompt", required: true },
          { name: "summary", path: "summary", required: true },
          { name: "improvementScore", path: "improvementScore", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 30000,
    },
  ],
};

export default config;
