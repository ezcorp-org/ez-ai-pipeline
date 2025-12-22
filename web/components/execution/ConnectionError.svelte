<script lang="ts">
  let { onReconnect, onViewOutputs }: {
    onReconnect?: () => void;
    onViewOutputs?: () => void;
  } = $props();
</script>

<div class="bg-slate-50 border border-slate-200 rounded-xl p-6">
  <div class="flex items-start gap-4">
    <div class="text-3xl">&#128268;</div>
    <div class="flex-1">
      <h3 class="font-semibold text-slate-800 text-lg mb-2">Connection Lost</h3>
      <p class="text-slate-600 mb-4">
        Lost connection to server. Execution may still be running.
      </p>

      <div class="flex gap-3">
        {#if onReconnect}
          <button
            onclick={onReconnect}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
          >
            Reconnect
          </button>
        {/if}
        {#if onViewOutputs}
          <button
            onclick={onViewOutputs}
            class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm cursor-pointer"
          >
            View Outputs
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>
