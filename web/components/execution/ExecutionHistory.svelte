<script lang="ts">
  interface ExecutionHistoryEntry {
    executionId: string;
    pipelineId: string;
    pipelineName: string;
    timestamp: string;
    status: 'completed' | 'failed' | 'cancelled';
    inputPreview: string;
  }

  let { onSelect }: { onSelect?: (executionId: string) => void } = $props();

  let history = $state<ExecutionHistoryEntry[]>([]);

  $effect(() => {
    try {
      const stored = localStorage.getItem('executionHistory');
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch {
      // localStorage not available or corrupt
      history = [];
    }
  });

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  const statusIcons: Record<string, string> = {
    completed: '',
    failed: '',
    cancelled: '',
  };

  const statusColors: Record<string, string> = {
    completed: 'text-green-600 bg-green-50',
    failed: 'text-red-600 bg-red-50',
    cancelled: 'text-yellow-600 bg-yellow-50',
  };
</script>

{#if history.length > 0}
  <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
    <h3 class="text-sm font-medium text-slate-500 mb-3">Recent Executions</h3>
    <div class="space-y-2">
      {#each history as entry}
        <button
          onclick={() => onSelect?.(entry.executionId)}
          class="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="font-medium text-slate-800 text-sm truncate">
                {entry.pipelineName}
              </div>
              <div class="text-xs text-slate-500 truncate mt-0.5">
                {entry.inputPreview}
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs px-2 py-0.5 rounded-full {statusColors[entry.status]}">
                {#if entry.status === 'completed'}
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                {:else if entry.status === 'failed'}
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                {:else}
                  <svg class="w-3 h-3 inline mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                {/if}
                {entry.status}
              </span>
              <span class="text-xs text-slate-400">
                {formatTime(entry.timestamp)}
              </span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
{/if}
