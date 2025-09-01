<script lang="ts">
  /**
   * Reusable status card with glass style and accent bar.
   * Props:
   * - state: "success" | "error" | "info" | "warning"
   * - title: short label (optional)
   * - method: small monospace label (optional)
   * - showBadge: show state badge (default true)
   */
  import { CheckCircle, XCircle, Info, AlertTriangle } from "@lucide/svelte";

  type StatusState = "success" | "error" | "info" | "warning";

  export let state: StatusState = "info";
  export let title: string = "";
  export let method: string = "";
  export let showBadge: boolean = true;
  export let description: string = "";
  export let resultText: string = "";
  export let code: string | null = null;


  const color = {
    success: {
      accent: "bg-emerald-400/70",
      border: "border-emerald-300/60 dark:border-emerald-700/60",
      chip: "from-emerald-500 to-emerald-600",
      text: "text-emerald-700 dark:text-emerald-300",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      icon: CheckCircle,
      label: "Success",
    },
    error: {
      accent: "bg-red-400/70",
      border: "border-red-300/60 dark:border-red-700/60",
      chip: "from-red-500 to-rose-600",
      text: "text-red-700 dark:text-red-300",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      icon: XCircle,
      label: "Error",
    },
    info: {
      accent: "bg-blue-400/70",
      border: "border-blue-300/60 dark:border-blue-700/60",
      chip: "from-blue-500 to-indigo-600",
      text: "text-blue-700 dark:text-blue-300",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      icon: Info,
      label: "Info",
    },
    warning: {
      accent: "bg-amber-400/70",
      border: "border-amber-300/60 dark:border-amber-700/60",
      chip: "from-amber-500 to-orange-600",
      text: "text-amber-700 dark:text-amber-300",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      icon: AlertTriangle,
      label: "Warning",
    },
  } as const;

  $: cfg = color[state];
</script>

<div class={`relative rounded-2xl overflow-hidden p-4 md:p-5 border shadow-sm backdrop-blur-sm bg-white/70 dark:bg-slate-800/40 ${cfg.border}`}>
  <div class={`absolute inset-y-0 left-0 w-1 ${cfg.accent}`}></div>
  <div class="flex items-start justify-between gap-3">
    <div class="flex items-center gap-3">
      <div class={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br ${cfg.chip}`}>
        <svelte:component this={cfg.icon} class="w-4 h-4 text-white" />
      </div>
      {#if method}
        <code class="text-sm font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-md">{method}</code>
      {/if}
      {#if title}
        <span class="text-sm font-semibold">{title}</span>
      {/if}
    </div>
    {#if showBadge}
      <span class={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.badge}`}>{color[state].label}</span>
    {/if}
  </div>
  {#if description}
    <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
  {/if}
  {#if resultText}
    <p class={`mt-1 text-sm ${cfg.text}`}>{resultText}</p>
  {/if}
  {#if code}
    <div class="mt-3 rounded-xl bg-slate-900 text-slate-100 text-xs p-3 overflow-x-auto">
      <pre class="whitespace-pre-wrap leading-relaxed"><code>{code}</code></pre>
    </div>
  {/if}
</div>


