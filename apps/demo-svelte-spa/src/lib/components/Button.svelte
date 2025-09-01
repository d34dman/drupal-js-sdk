<script lang="ts">
  import type { ComponentEvents } from 'svelte';

  export let variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' = 'primary';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let fullWidth: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';

  // Base classes for all buttons
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size variations
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  // Variant styles
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 focus:ring-blue-500",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-[1.02] focus:ring-slate-500",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 focus:ring-emerald-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/25 hover:scale-105 focus:ring-amber-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105 focus:ring-red-500",
    ghost: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] focus:ring-slate-500"
  };

  // Full width modifier
  const widthClass = fullWidth ? "w-full" : "";

  // Loading state modifier
  const loadingClasses = loading ? "cursor-wait" : "";

  // Combine all classes
  $: buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${loadingClasses}`.trim();

  // Disabled state - override some styles when disabled
  $: isDisabled = disabled || loading;
</script>

<button
  {type}
  class={buttonClasses}
  disabled={isDisabled}
  on:click
  on:focus
  on:blur
  on:mouseenter
  on:mouseleave
  {...$$restProps}
>
  {#if loading}
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  
  <slot />
</button>
