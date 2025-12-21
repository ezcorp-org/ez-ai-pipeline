<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Dashboard from "./Dashboard.svelte";
  import PipelineList from "./pipelines/PipelineList.svelte";
  import PipelineDetail from "./pipelines/PipelineDetail.svelte";
  import OutputList from "./outputs/OutputList.svelte";
  import OutputDetail from "./outputs/OutputDetail.svelte";

  let currentPath = $state(window.location.pathname);

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    currentPath = path;
  }

  $effect(() => {
    const handlePopState = () => {
      currentPath = window.location.pathname;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  });

  function getView(): string {
    if (currentPath === "/" || currentPath === "") return "dashboard";
    if (currentPath === "/pipelines") return "pipelines";
    if (currentPath.startsWith("/pipelines/")) return "pipeline-detail";
    if (currentPath === "/outputs") return "outputs";
    if (currentPath.startsWith("/outputs/")) return "output-detail";
    return "dashboard";
  }

  function getPipelineId(): string {
    return currentPath.replace("/pipelines/", "");
  }

  function getOutputFilename(): string {
    return currentPath.replace("/outputs/", "");
  }

  let view = $derived(getView());
  let pipelineId = $derived(getPipelineId());
  let outputFilename = $derived(getOutputFilename());
</script>

<div class="flex min-h-screen">
  <Sidebar {currentPath} {navigate} />

  <main class="flex-1 ml-64 p-8">
    {#if view === "dashboard"}
      <Dashboard {navigate} />
    {:else if view === "pipelines"}
      <PipelineList {navigate} />
    {:else if view === "pipeline-detail"}
      <PipelineDetail id={pipelineId} {navigate} />
    {:else if view === "outputs"}
      <OutputList {navigate} />
    {:else if view === "output-detail"}
      <OutputDetail filename={outputFilename} {navigate} />
    {/if}
  </main>
</div>
