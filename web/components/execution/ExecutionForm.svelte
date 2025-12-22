<script lang="ts">
  import ExecutionProgress from './ExecutionProgress.svelte';
  import ExecutionResult from './ExecutionResult.svelte';
  import ExecutionHistory from './ExecutionHistory.svelte';

  interface ExecutionResultData {
    status: string;
    pipelineId: string;
    summary?: {
      totalDuration: number;
      totalCost: number;
      stagesRun: number;
      stagesSkipped: number;
      stagesFailed: number;
    };
    output?: string;
    error?: string;
  }

  interface ExecutionHistoryEntry {
    executionId: string;
    pipelineId: string;
    pipelineName: string;
    timestamp: string;
    status: 'completed' | 'failed' | 'cancelled';
    inputPreview: string;
  }

  interface CLIToolStatus {
    available: boolean;
    version?: string;
    error?: string;
  }

  interface ConfigStatus {
    hasApiKey: boolean;
    cliTools: {
      claude: CLIToolStatus;
      opencode: CLIToolStatus;
      aider: CLIToolStatus;
    };
  }

  let { pipelineId, pipelineName, stageCount }: {
    pipelineId: string;
    pipelineName?: string;
    stageCount: number;
  } = $props();

  let input = $state('');
  let status = $state<'idle' | 'running' | 'completed' | 'failed'>('idle');
  let executionId = $state<string | null>(null);
  let error = $state<string | null>(null);
  let result = $state<ExecutionResultData | null>(null);
  let configStatus = $state<'checking' | 'loaded'>('checking');
  let config = $state<ConfigStatus | null>(null);
  let executionMode = $state<'api' | 'cli'>('api');
  let selectedCliTool = $state<'claude' | 'opencode' | 'aider'>('claude');
  let cancelRequested = $state(false);

  // Check config status on mount
  $effect(() => {
    fetch('/api/config/status')
      .then(r => r.json())
      .then((data: ConfigStatus) => {
        config = data;
        configStatus = 'loaded';

        // Auto-select execution mode based on what's available
        if (data.hasApiKey) {
          executionMode = 'api';
        } else {
          executionMode = 'cli';
          // Select first available CLI tool
          if (data.cliTools.claude.available) {
            selectedCliTool = 'claude';
          } else if (data.cliTools.opencode.available) {
            selectedCliTool = 'opencode';
          } else if (data.cliTools.aider.available) {
            selectedCliTool = 'aider';
          }
        }
      })
      .catch(() => {
        configStatus = 'loaded';
        config = { hasApiKey: false, cliTools: { claude: { available: false }, opencode: { available: false }, aider: { available: false } } };
      });
  });

  // Check if execution is possible
  let canExecute = $derived(() => {
    if (!config) return false;
    if (executionMode === 'api') return config.hasApiKey;
    return config.cliTools[selectedCliTool]?.available ?? false;
  });

  // Keyboard shortcuts
  $effect(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Ctrl+Enter to run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (status !== 'running' && input.trim() && canExecute()) {
          e.preventDefault();
          runPipeline();
        }
      }
      // Escape to cancel
      if (e.key === 'Escape' && status === 'running') {
        e.preventDefault();
        cancelExecution();
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });

  async function runPipeline() {
    if (!input.trim() || !canExecute()) return;

    status = 'running';
    error = null;
    result = null;
    cancelRequested = false;

    try {
      const body: Record<string, unknown> = {
        input: input.trim(),
        executionMode,
      };

      if (executionMode === 'cli') {
        body.cliTool = selectedCliTool;
      }

      const response = await fetch(`/api/pipelines/${pipelineId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start execution');
      }

      const data = await response.json();
      executionId = data.executionId;
    } catch (e) {
      status = 'failed';
      error = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  async function cancelExecution() {
    if (!executionId || cancelRequested) return;

    // Confirm for running executions
    if (status === 'running') {
      cancelRequested = true;
      try {
        await fetch(`/api/executions/${executionId}/cancel`, { method: 'POST' });
      } catch {
        // Ignore cancel errors
      }
    }
  }

  function handleComplete(execResult: ExecutionResultData) {
    result = execResult;
    status = execResult.status === 'success' || execResult.status === 'completed' ? 'completed' : 'failed';

    // Save to history
    saveToHistory({
      executionId: executionId!,
      pipelineId,
      pipelineName: pipelineName || pipelineId,
      timestamp: new Date().toISOString(),
      status: execResult.status === 'success' || execResult.status === 'completed' ? 'completed' :
              execResult.status === 'cancelled' ? 'cancelled' : 'failed',
      inputPreview: input.trim().substring(0, 100),
    });
  }

  function saveToHistory(entry: ExecutionHistoryEntry) {
    try {
      const history = JSON.parse(localStorage.getItem('executionHistory') || '[]');
      history.unshift(entry);
      localStorage.setItem('executionHistory', JSON.stringify(history.slice(0, 3)));
    } catch {
      // localStorage not available
    }
  }

  function reset() {
    status = 'idle';
    executionId = null;
    result = null;
    error = null;
    cancelRequested = false;
  }
</script>

{#if configStatus === 'checking'}
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <div class="flex items-center justify-center py-8">
      <div class="text-slate-500">Checking configuration...</div>
    </div>
  </div>
{:else if !canExecute()}
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h3 class="font-semibold text-amber-800 mb-2">No Execution Method Available</h3>
      <p class="text-amber-700 text-sm mb-3">
        To run pipelines, you need either an Anthropic API key or a CLI tool installed.
      </p>
      <div class="text-sm text-amber-700 space-y-2">
        <p><strong>Option 1:</strong> Set ANTHROPIC_API_KEY environment variable</p>
        <p><strong>Option 2:</strong> Install Claude Code: <code class="bg-amber-100 px-1.5 py-0.5 rounded">npm install -g @anthropic-ai/claude-code</code></p>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <h2 class="font-semibold text-slate-700 mb-4 flex items-center gap-2">
      <span class="text-xl">&#9654;</span> Run Pipeline
    </h2>

    <!-- Execution Mode Selector -->
    <div class="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-sm font-medium text-slate-600">Execution Mode:</span>
        <div class="flex gap-2">
          <button
            onclick={() => executionMode = 'api'}
            disabled={!config?.hasApiKey || status === 'running'}
            class="px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer {executionMode === 'api' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed"
          >
            API
            {#if config?.hasApiKey}
              <span class="ml-1 text-xs opacity-75">(ready)</span>
            {/if}
          </button>
          <button
            onclick={() => executionMode = 'cli'}
            disabled={!config?.cliTools.claude.available && !config?.cliTools.opencode.available && !config?.cliTools.aider.available || status === 'running'}
            class="px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer {executionMode === 'cli' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CLI Tool
          </button>
        </div>

        {#if executionMode === 'cli'}
          <div class="flex gap-2 ml-4">
            <span class="text-sm text-slate-500">Tool:</span>
            <select
              bind:value={selectedCliTool}
              disabled={status === 'running'}
              class="text-sm border border-slate-300 rounded-lg px-2 py-1 bg-white disabled:opacity-50"
            >
              {#if config?.cliTools.claude.available}
                <option value="claude">Claude Code {config.cliTools.claude.version ? `(${config.cliTools.claude.version})` : ''}</option>
              {/if}
              {#if config?.cliTools.opencode.available}
                <option value="opencode">OpenCode {config.cliTools.opencode.version ? `(${config.cliTools.opencode.version})` : ''}</option>
              {/if}
              {#if config?.cliTools.aider.available}
                <option value="aider">Aider {config.cliTools.aider.version ? `(${config.cliTools.aider.version})` : ''}</option>
              {/if}
            </select>
          </div>
        {/if}
      </div>
      <p class="text-xs text-slate-500 mt-2">
        {#if executionMode === 'api'}
          Uses your Anthropic API key to call Claude directly.
        {:else}
          Uses {selectedCliTool === 'claude' ? 'Claude Code' : selectedCliTool === 'opencode' ? 'OpenCode' : 'Aider'} CLI for execution. No API key required.
        {/if}
      </p>
    </div>

    <div class="mb-4">
      <label for="prompt-input" class="block text-sm font-medium text-slate-600 mb-2">
        Enter your prompt to optimize
      </label>
      <textarea
        id="prompt-input"
        bind:value={input}
        disabled={status === 'running'}
        placeholder="Type your prompt here..."
        class="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-slate-50 disabled:text-slate-500"
      ></textarea>
      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-500">{input.length} characters</span>
          <span class="text-xs text-slate-400">Ctrl+Enter to run</span>
        </div>
        <div class="flex gap-2">
          {#if status === 'running'}
            <button
              onclick={cancelExecution}
              disabled={cancelRequested}
              class="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {cancelRequested ? 'Cancelling...' : 'Cancel'}
            </button>
          {:else if status === 'completed' || status === 'failed'}
            <button
              onclick={reset}
              class="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              New Run
            </button>
          {/if}
          <button
            onclick={runPipeline}
            disabled={status === 'running' || !input.trim() || !canExecute()}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
          >
            {#if status === 'running'}
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running...
            {:else}
              Run Pipeline &#9654;
            {/if}
          </button>
        </div>
      </div>
    </div>

    {#if error}
      <div class="bg-red-50 text-red-600 p-4 rounded-lg mt-4 border border-red-200">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div class="font-medium">Error</div>
            <div class="text-sm mt-1">{error}</div>
            <button
              onclick={runPipeline}
              class="mt-2 text-sm text-red-700 hover:text-red-800 underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if status === 'idle'}
    <ExecutionHistory />
  {/if}
{/if}

{#if executionId}
  <ExecutionProgress
    {executionId}
    {stageCount}
    onComplete={handleComplete}
  />
{/if}

{#if result}
  <div class="mt-6">
    <ExecutionResult {result} />
  </div>
{/if}
