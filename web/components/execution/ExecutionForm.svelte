<script lang="ts">
  import ExecutionProgress from './ExecutionProgress.svelte';
  import ExecutionResult from './ExecutionResult.svelte';
  import ApiKeyWarning from './ApiKeyWarning.svelte';
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
  let apiKeyStatus = $state<'checking' | 'missing' | 'present'>('checking');
  let cancelRequested = $state(false);

  // Check API key status on mount
  $effect(() => {
    fetch('/api/config/status')
      .then(r => r.json())
      .then(data => {
        apiKeyStatus = data.hasApiKey ? 'present' : 'missing';
      })
      .catch(() => {
        apiKeyStatus = 'present'; // Assume present if check fails
      });
  });

  // Keyboard shortcuts
  $effect(() => {
    function handleKeydown(e: KeyboardEvent) {
      // Ctrl+Enter to run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (status !== 'running' && input.trim() && apiKeyStatus === 'present') {
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
    if (!input.trim()) return;

    status = 'running';
    error = null;
    result = null;
    cancelRequested = false;

    try {
      const response = await fetch(`/api/pipelines/${pipelineId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
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

{#if apiKeyStatus === 'checking'}
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <div class="flex items-center justify-center py-8">
      <div class="text-slate-500">Checking configuration...</div>
    </div>
  </div>
{:else if apiKeyStatus === 'missing'}
  <div class="mb-6">
    <ApiKeyWarning />
  </div>
{:else}
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
    <h2 class="font-semibold text-slate-700 mb-4 flex items-center gap-2">
      <span class="text-xl">&#9654;</span> Run Pipeline
    </h2>

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
              class="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              {cancelRequested ? 'Cancelling...' : 'Cancel'}
            </button>
          {:else if status === 'completed' || status === 'failed'}
            <button
              onclick={reset}
              class="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              New Run
            </button>
          {/if}
          <button
            onclick={runPipeline}
            disabled={status === 'running' || !input.trim()}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
              class="mt-2 text-sm text-red-700 hover:text-red-800 underline"
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
