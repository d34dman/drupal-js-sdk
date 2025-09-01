<script lang="ts">
  import CodeBlock from "./CodeBlock.svelte";
  export let title: string = "";
  export let code: string = "";
  let open = false;
</script>

<div class="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm">
  <div class="flex items-center justify-between px-4 py-3">
    <h3 class="font-semibold text-sm">{title}</h3>
    <button
      class="btn btn-outline btn-xs"
      aria-expanded={open}
      on:click={() => (open = !open)}
    >
      {open ? "Hide" : "Show"}
    </button>
  </div>
  {#if open}
    <div class="px-4 pb-4">
      <CodeBlock code={code} language="json" title={title} />
    </div>
  {/if}
</div>


