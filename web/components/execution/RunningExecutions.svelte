<script lang="ts">
  import ExecutionCard from './ExecutionCard.svelte';
  import HistoryCard from './HistoryCard.svelte';

  interface Execution {
    id: string;
    pipelineId: string;
    pipelineName: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    startTime: number;
    currentStage: number;
    totalStages: number;
    inputPreview: string;
  }

  interface HistoryRecord {
    id: string;
    pipelineId: string;
    pipelineName: string;
    status: 'completed' | 'failed' | 'cancelled';
    startTime: number;
    endTime: number;
    duration: number;
    totalStages: number;
    stagesRun: number;
    stagesSkipped: number;
    stagesFailed: number;
    inputPreview: string;
    totalCost: number;
    error?: string;
  }

  interface HistoryPage {
    executions: HistoryRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }

  let { navigate }: { navigate: (path: string) => void } = $props();

  let activeExecutions = $state<Execution[]>([]);
  let historyPage = $state<HistoryPage | null>(null);
  let currentPage = $state(1);
  let loading = $state(true);
  let historyLoading = $state(false);
  let error = $state<string | null>(null);

  async function fetchActiveExecutions() {
    try {
      const res = await fetch('/api/executions/running');
      if (!res.ok) throw new Error('Failed to fetch executions');
      const data = await res.json();
      activeExecutions = data.executions;
      error = null;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  async function fetchHistory(page: number = 1) {
    historyLoading = true;
    try {
      const res = await fetch(`/api/executions/history?page=${page}&pageSize=20`);
      if (!res.ok) throw new Error('Failed to fetch history');
      historyPage = await res.json();
      currentPage = page;
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      historyLoading = false;
    }
  }

  $effect(() => {
    fetchActiveExecutions();
    fetchHistory(1);
    const interval = setInterval(fetchActiveExecutions, 2000);
    return () => clearInterval(interval);
  });

  function handleExecutionClick(execution: Execution) {
    navigate(`/executions/${execution.id}`);
  }

  function handleHistoryClick(record: HistoryRecord) {
    navigate(`/executions/${record.id}`);
  }

  function goToPage(page: number) {
    if (page >= 1 && historyPage && page <= historyPage.totalPages) {
      fetchHistory(page);
    }
  }

  function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  function formatCost(cost: number): string {
    return `$${cost.toFixed(4)}`;
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
</script>

<div class="max-w-4xl">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Executions</h1>
      <p class="text-slate-500 mt-1">Monitor active runs and view execution history</p>
    </div>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3 text-slate-500">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading executions...</span>
      </div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p class="font-medium">Error loading executions</p>
      <p class="text-sm">{error}</p>
    </div>
  {:else}
    <!-- Active Runs Section -->
    <section class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <h2 class="text-lg font-semibold text-slate-700">Active Runs</h2>
        {#if activeExecutions.length > 0}
          <span class="text-sm text-slate-500">({activeExecutions.length})</span>
        {/if}
      </div>

      {#if activeExecutions.length === 0}
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="text-base font-medium text-slate-700 mb-1">No Active Runs</h3>
          <p class="text-sm text-slate-500">
            Start a pipeline to see live execution progress here.
          </p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each activeExecutions as execution (execution.id)}
            <ExecutionCard
              {execution}
              onselect={() => handleExecutionClick(execution)}
            />
          {/each}
        </div>
      {/if}
    </section>

    <!-- Previous Executions Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-slate-700">Previous Executions</h2>
          {#if historyPage}
            <span class="text-sm text-slate-500">({historyPage.total} total)</span>
          {/if}
        </div>
        {#if historyLoading}
          <svg class="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {/if}
      </div>

      {#if !historyPage || historyPage.executions.length === 0}
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <div class="text-3xl mb-3">📋</div>
          <h3 class="text-base font-medium text-slate-700 mb-1">No Execution History</h3>
          <p class="text-sm text-slate-500">
            Completed pipeline runs will appear here.
          </p>
        </div>
      {:else}
        <div class="space-y-2">
          {#each historyPage.executions as record (record.id)}
            <HistoryCard
              {record}
              {formatDuration}
              {formatCost}
              {formatTime}
              onclick={() => handleHistoryClick(record)}
            />
          {/each}
        </div>

        <!-- Pagination Controls -->
        {#if historyPage.totalPages > 1}
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div class="text-sm text-slate-500">
              Page {historyPage.page} of {historyPage.totalPages}
            </div>
            <div class="flex items-center gap-2">
              <button
                onclick={() => goToPage(1)}
                disabled={currentPage === 1}
                class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                onclick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div class="flex items-center gap-1">
                {#each Array.from({ length: Math.min(5, historyPage.totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(currentPage - 2, historyPage.totalPages - 4));
                  return start + i;
                }).filter(p => p <= historyPage.totalPages) as pageNum}
                  <button
                    onclick={() => goToPage(pageNum)}
                    class="w-8 h-8 text-sm rounded-lg transition-colors {pageNum === currentPage ? 'bg-blue-500 text-white' : 'border border-slate-200 hover:bg-slate-50'}"
                  >
                    {pageNum}
                  </button>
                {/each}
              </div>
              <button
                onclick={() => goToPage(currentPage + 1)}
                disabled={currentPage === historyPage.totalPages}
                class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onclick={() => goToPage(historyPage.totalPages)}
                disabled={currentPage === historyPage.totalPages}
                class="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </div>
          </div>
        {/if}
      {/if}
    </section>
  {/if}
</div>
