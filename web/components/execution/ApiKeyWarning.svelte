<script lang="ts">
  // No props needed - this is a static warning component
</script>

<div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
  <div class="flex items-start gap-4">
    <div class="text-3xl">&#9888;&#65039;</div>
    <div class="flex-1">
      <h3 class="font-semibold text-amber-800 text-lg mb-2">API Key Required</h3>
      <p class="text-amber-700 mb-4">
        To run pipelines, you need to set the <code class="bg-amber-100 px-1.5 py-0.5 rounded text-sm">ANTHROPIC_API_KEY</code> environment variable.
      </p>

      <div class="bg-white rounded-lg border border-amber-200 p-4 mb-4">
        <p class="text-sm text-slate-600 mb-2">Run the server with:</p>
        <div class="bg-slate-800 text-green-400 rounded-lg p-3 font-mono text-sm overflow-x-auto">
          ANTHROPIC_API_KEY=sk-... bun run web
        </div>
      </div>

      <p class="text-sm text-amber-700 mb-3">
        Or use the <code class="bg-amber-100 px-1.5 py-0.5 rounded">ez-ai-pipeline set-key</code> CLI command to save your key.
      </p>

      <a
        href="https://console.anthropic.com/settings/keys"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 underline"
      >
        Get an API key from Anthropic Console
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
    </div>
  </div>
</div>
