<script lang="ts">
  let { currentPath, navigate }: { currentPath: string; navigate: (path: string) => void } = $props();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/pipelines", label: "Pipelines", icon: "🔧" },
    { path: "/outputs", label: "Outputs", icon: "📄" },
  ];

  function isActive(path: string): boolean {
    if (path === "/") return currentPath === "/" || currentPath === "";
    return currentPath.startsWith(path);
  }

  function handleClick(e: MouseEvent, path: string) {
    e.preventDefault();
    navigate(path);
  }
</script>

<aside class="fixed left-0 top-0 h-full w-60 bg-slate-900 text-white flex flex-col">
  <div class="p-4 border-b border-slate-700">
    <h1 class="text-xl font-bold flex items-center gap-2">
      <span class="text-2xl">⚡</span>
      Pipeline Viewer
    </h1>
    <p class="text-xs text-slate-400 mt-1">ezAiPipeline Dashboard</p>
  </div>

  <nav class="flex-1 py-4">
    {#each navItems as item}
      <a
        href={item.path}
        onclick={(e) => handleClick(e, item.path)}
        class="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors {isActive(item.path) ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
      >
        <span class="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <div class="p-4 border-t border-slate-700 text-xs text-slate-500">
    <p>Built with Bun + Svelte</p>
  </div>
</aside>
