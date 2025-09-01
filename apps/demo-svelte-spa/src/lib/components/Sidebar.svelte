<script lang="ts">
  import { LogOut, BookOpen, Server, Database, Settings, Menu, Shield, Home, X } from "@lucide/svelte";
  
  export let demos: Array<{ id: string; name: string; component: any }>;
  export let activeDemo: string;
  export let onNavigate: (demoId: string) => void;
  export let onLogout: () => void;
  export let isOpen: boolean = false;
  export let onToggle: () => void;

  // Icon mapping for each demo
  const iconMap: Record<string, any> = {
    overview: Home,
    auth: Shield,
    core: Settings,
    entity: Database,
    xhr: Server,
    menu: Menu,
    storage: BookOpen,
  };

  function handleNavigate(demoId: string): void {
    onNavigate(demoId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onToggle();
    }
  }
</script>

<!-- Mobile Overlay -->
{#if isOpen}
  <button 
    class="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
    onclick={onToggle}
    aria-label="Close sidebar"
  ></button>
{/if}

<aside class="fixed lg:static top-0 left-0 z-50 w-80 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out {isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
  <!-- Modern Header with Branding -->
  <div class="px-6 border-b border-slate-200/50 dark:border-slate-700/50 h-20">
    <div class="flex items-center justify-between h-full">
      <button 
        class="flex items-center space-x-3 flex-1 text-left group hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-lg transition-all duration-200 -mx-2 px-2 cursor-pointer"
        onclick={() => handleNavigate('overview')}
        title="Go to Overview"
      >
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
          <Home class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">Drupal JS SDK</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Educational Demo</p>
        </div>
      </button>
      
      <!-- Close button for mobile -->
      <button 
        class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
        onclick={onToggle}
        title="Close Menu"
      >
        <X class="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </button>
    </div>
  </div>

  <!-- Modern Navigation Menu -->
  <nav class="flex-1 p-4 space-y-1">
    {#each demos as demo}
      <button
        class="group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 {activeDemo === demo.id 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}"
        onclick={() => handleNavigate(demo.id)}
      >
        <svelte:component 
          this={iconMap[demo.id] || Home} 
          class="w-5 h-5 mr-3 {activeDemo === demo.id ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}" 
        />
        <span class="truncate">{demo.name}</span>
        {#if activeDemo === demo.id}
          <div class="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
        {/if}
      </button>
    {/each}
  </nav>

  <!-- Modern Footer -->
  <div class="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-slate-600 dark:text-slate-400">Backend Connected</span>
      </div>
      <span class="text-xs text-slate-500 dark:text-slate-500">v1.0.0</span>
    </div>
    
    <button 
      class="group w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50 hover:border-red-200 dark:hover:border-red-800"
      onclick={onLogout}
    >
      <LogOut class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
      Sign Out
    </button>
  </div>
</aside>

