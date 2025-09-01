<script lang="ts">
  /**
   * Reusable Pills component for badges, labels, and status indicators
   * 
   * @component Pills
   * @description A flexible pill component that can display various states, types, and sizes
   * @example
   * ```svelte
   * <Pills variant="success">Published</Pills>
   * <Pills variant="danger" size="sm">Error</Pills>
   * <Pills variant="info" outline>HTTP</Pills>
   * ```
   */

  export let variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral' = 'primary';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let outline: boolean = false;
  export let rounded: boolean = true;
  export let removable: boolean = false;
  export let disabled: boolean = false;

  /**
   * Handle remove action for removable pills
   */
  function handleRemove(event: Event): void {
    event.stopPropagation();
    // Dispatch custom event for parent to handle
    const removeEvent = new CustomEvent('remove');
    event.target?.dispatchEvent(removeEvent);
  }

  // Variant color classes
  const variantClasses = {
    primary: outline 
      ? 'border-blue-300 text-blue-700 bg-transparent dark:border-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    
    secondary: outline
      ? 'border-slate-300 text-slate-700 bg-transparent dark:border-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/20'
      : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200 border-slate-200 dark:border-slate-800',
    
    success: outline
      ? 'border-emerald-300 text-emerald-700 bg-transparent dark:border-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    
    danger: outline
      ? 'border-red-300 text-red-700 bg-transparent dark:border-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800',
    
    warning: outline
      ? 'border-amber-300 text-amber-700 bg-transparent dark:border-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    
    info: outline
      ? 'border-sky-300 text-sky-700 bg-transparent dark:border-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20'
      : 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200 border-sky-200 dark:border-sky-800',
    
    neutral: outline
      ? 'border-gray-300 text-gray-700 bg-transparent dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200 border-gray-200 dark:border-gray-800'
  };

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Computed classes
  $: pillClasses = [
    'inline-flex items-center font-medium border transition-all duration-200',
    variantClasses[variant],
    sizeClasses[size],
    rounded ? (size === 'xs' ? 'rounded-full' : size === 'sm' ? 'rounded-full' : 'rounded-full') : 'rounded-md',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default',
    removable ? 'pr-1' : '',
    outline ? 'border' : 'border-transparent'
  ].filter(Boolean).join(' ');
</script>

<span 
  class={pillClasses}
  class:opacity-50={disabled}
  role={disabled ? "text" : "status"}
>
  <slot />
  
  {#if removable && !disabled}
    <button
      type="button"
      class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      onclick={handleRemove}
      aria-label="Remove"
    >
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 6l12 12M6 18L18 6"/>
      </svg>
    </button>
  {/if}
</span>
