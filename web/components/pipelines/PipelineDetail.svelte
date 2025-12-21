<script lang="ts">
  import ExecutionForm from '../execution/ExecutionForm.svelte';

  let { id, navigate }: { id: string; navigate: (path: string) => void } = $props();

  interface Stage {
    id: string;
    name: string;
    type: string;
    description?: string;
    model: {
      providerID: string;
      modelID: string;
      tier: string;
      maxTokens: number;
      temperature: number;
    };
    prompt: {
      systemPrompt: string;
      template: string;
      variables: Array<{
        name: string;
        source: string;
        path?: string;
        stageId?: string;
      }>;
    };
    output: {
      format: string;
      extract: Array<{ name: string; path: string; required: boolean }>;
    };
    conditions?: {
      skipIf?: { condition: any; sourceStage: string };
      runIf?: { condition: any; sourceStage: string };
      earlyExit?: { condition: any; returnStage: string };
    };
  }

  interface Pipeline {
    pipeline: {
      id: string;
      name: string;
      version: string;
      description: string;
      defaultProvider: string;
      settings: Record<string, any>;
    };
    stages: Stage[];
  }

  let pipeline = $state<Pipeline | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let expandedStage = $state<string | null>(null);

  $effect(() => {
    loading = true;
    fetch(`/api/pipelines/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Pipeline not found");
        return r.json();
      })
      .then((data) => {
        pipeline = data;
        loading = false;
      })
      .catch((e) => {
        error = e.message;
        loading = false;
      });
  });

  const stageTypeColors: Record<string, string> = {
    analyze: "bg-blue-100 text-blue-700 border-blue-300",
    structure: "bg-purple-100 text-purple-700 border-purple-300",
    enhance: "bg-green-100 text-green-700 border-green-300",
    validate: "bg-orange-100 text-orange-700 border-orange-300",
    iterate: "bg-yellow-100 text-yellow-700 border-yellow-300",
    test: "bg-cyan-100 text-cyan-700 border-cyan-300",
    custom: "bg-gray-100 text-gray-700 border-gray-300",
  };

  const stageTypeIcons: Record<string, string> = {
    analyze: "🔍",
    structure: "📐",
    enhance: "✨",
    validate: "✅",
    iterate: "🔄",
    test: "🧪",
    custom: "⚙️",
  };

  function toggleStage(stageId: string) {
    expandedStage = expandedStage === stageId ? null : stageId;
  }

  function getModelShortName(modelId: string): string {
    if (modelId.includes("haiku")) return "Haiku";
    if (modelId.includes("sonnet")) return "Sonnet";
    if (modelId.includes("opus")) return "Opus";
    if (modelId.includes("gpt-4o-mini")) return "GPT-4o Mini";
    if (modelId.includes("gpt-4o")) return "GPT-4o";
    if (modelId.includes("gemini")) return "Gemini";
    return modelId;
  }
</script>

<div>
  <button onclick={() => navigate("/pipelines")} class="text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1">
    ← Back to Pipelines
  </button>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading pipeline...</div>
    </div>
  {:else if error}
    <div class="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  {:else if pipeline}
    <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">{pipeline.pipeline.name}</h1>
          <p class="text-sm text-slate-500 mt-1">
            v{pipeline.pipeline.version} · {pipeline.pipeline.defaultProvider} · {pipeline.stages.length} stages
          </p>
        </div>
        <span class="text-3xl">🔧</span>
      </div>
      {#if pipeline.pipeline.description}
        <p class="text-slate-600 mt-4">{pipeline.pipeline.description}</p>
      {/if}

      <div class="mt-4 flex flex-wrap gap-2">
        {#if pipeline.pipeline.settings?.enableCaching}
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Caching</span>
        {/if}
        {#if pipeline.pipeline.settings?.enableEarlyExit}
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Early Exit</span>
        {/if}
        {#if pipeline.pipeline.settings?.maxRetries}
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
            {pipeline.pipeline.settings.maxRetries} retries
          </span>
        {/if}
      </div>
    </div>

    <ExecutionForm pipelineId={pipeline.pipeline.id} pipelineName={pipeline.pipeline.name} stageCount={pipeline.stages.length} />

    <div class="space-y-4">
      <h2 class="font-semibold text-slate-700 mb-4">Pipeline Stages</h2>

      {#each pipeline.stages as stage, index}
        <div class="relative">
          {#if index > 0}
            <div class="absolute left-6 -top-4 w-0.5 h-4 bg-slate-300"></div>
          {/if}

          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden {expandedStage === stage.id ? 'ring-2 ring-blue-200' : ''}">
            <button
              onclick={() => toggleStage(stage.id)}
              class="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-slate-800">{stage.name}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full border {stageTypeColors[stage.type] || stageTypeColors.custom}">
                    {stageTypeIcons[stage.type] || "⚙️"} {stage.type}
                  </span>
                </div>
                <div class="text-sm text-slate-500 mt-1">
                  {getModelShortName(stage.model.modelID)} · temp: {stage.model.temperature}
                </div>
              </div>

              {#if stage.conditions?.skipIf || stage.conditions?.runIf || stage.conditions?.earlyExit}
                <span class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Conditional</span>
              {/if}

              <span class="text-slate-400 text-lg">{expandedStage === stage.id ? "−" : "+"}</span>
            </button>

            {#if expandedStage === stage.id}
              <div class="border-t border-slate-200 p-4 bg-slate-50">
                {#if stage.description}
                  <p class="text-sm text-slate-600 mb-4">{stage.description}</p>
                {/if}

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Model</h4>
                  <div class="bg-white rounded-lg p-3 border border-slate-200 text-sm">
                    <div class="grid grid-cols-2 gap-2">
                      <div><span class="text-slate-500">Provider:</span> {stage.model.providerID}</div>
                      <div><span class="text-slate-500">Model:</span> {stage.model.modelID}</div>
                      <div><span class="text-slate-500">Tier:</span> {stage.model.tier}</div>
                      <div><span class="text-slate-500">Max Tokens:</span> {stage.model.maxTokens}</div>
                      <div><span class="text-slate-500">Temperature:</span> {stage.model.temperature}</div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">System Prompt</h4>
                  <pre class="text-xs whitespace-pre-wrap">{stage.prompt.systemPrompt}</pre>
                </div>

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Template</h4>
                  <pre class="text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">{stage.prompt.template}</pre>
                </div>

                {#if stage.prompt.variables?.length}
                  <div class="mb-4">
                    <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Variables</h4>
                    <div class="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                      {#each stage.prompt.variables as variable}
                        <div class="p-2 text-sm flex items-center gap-2">
                          <code class="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">{`{{${variable.name}}}`}</code>
                          <span class="text-slate-400">←</span>
                          <span class="text-slate-600">
                            {variable.source}
                            {#if variable.stageId}
                              <span class="text-slate-400">({variable.stageId})</span>
                            {/if}
                            {#if variable.path}
                              <span class="text-slate-400">.{variable.path}</span>
                            {/if}
                          </span>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}

                <div class="mb-4">
                  <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Output Extraction</h4>
                  <div class="bg-white rounded-lg p-3 border border-slate-200 text-sm">
                    <div class="mb-2"><span class="text-slate-500">Format:</span> {stage.output.format}</div>
                    <div class="flex flex-wrap gap-1">
                      {#each stage.output.extract || [] as field}
                        <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                          {field.name}{#if field.required}<span class="text-green-500">*</span>{/if}
                        </span>
                      {/each}
                    </div>
                  </div>
                </div>

                {#if stage.conditions?.skipIf || stage.conditions?.runIf || stage.conditions?.earlyExit}
                  <div>
                    <h4 class="text-xs font-semibold text-slate-500 uppercase mb-2">Conditions</h4>
                    <div class="bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm">
                      {#if stage.conditions.skipIf}
                        <div class="mb-1">
                          <span class="font-medium text-amber-700">Skip if:</span>
                          <code class="ml-2 text-xs">{JSON.stringify(stage.conditions.skipIf.condition)}</code>
                          <span class="text-slate-500"> from {stage.conditions.skipIf.sourceStage}</span>
                        </div>
                      {/if}
                      {#if stage.conditions.runIf}
                        <div class="mb-1">
                          <span class="font-medium text-amber-700">Run if:</span>
                          <code class="ml-2 text-xs">{JSON.stringify(stage.conditions.runIf.condition)}</code>
                          <span class="text-slate-500"> from {stage.conditions.runIf.sourceStage}</span>
                        </div>
                      {/if}
                      {#if stage.conditions.earlyExit}
                        <div>
                          <span class="font-medium text-amber-700">Early exit:</span>
                          <code class="ml-2 text-xs">{JSON.stringify(stage.conditions.earlyExit.condition)}</code>
                          <span class="text-slate-500"> return to {stage.conditions.earlyExit.returnStage}</span>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          {#if index < pipeline.stages.length - 1}
            <div class="absolute left-6 -bottom-4 w-0.5 h-4 bg-slate-300"></div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
