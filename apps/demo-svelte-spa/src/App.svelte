<script lang="ts">
  import Login from "./lib/components/Login.svelte";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import DemoAuth from "./lib/demos/DemoAuth.svelte";
  import DemoMenu from "./lib/demos/DemoMenu.svelte";
  import DemoEntity from "./lib/demos/DemoEntity.svelte";
  import DemoXHR from "./lib/demos/DemoXHR.svelte";
  import DemoCore from "./lib/demos/DemoCore.svelte";
  import DemoStorage from "./lib/demos/DemoStorage.svelte";
  import DemoOverview from "./lib/demos/DemoOverview.svelte";
  import { authState, logout } from "./lib/authStore";
  import { Menu } from "@lucide/svelte";

  let activeDemo = $state("overview");
  let sidebarOpen = $state(false);

  const demos = [
    { id: "overview", name: "Overview", component: DemoOverview },
    { id: "auth", name: "Authentication", component: DemoAuth },
    { id: "menu", name: "Menu System", component: DemoMenu },
    { id: "entity", name: "Entities", component: DemoEntity },
    { id: "xhr", name: "HTTP Client", component: DemoXHR },
    { id: "core", name: "Core SDK", component: DemoCore },
    { id: "storage", name: "Storage", component: DemoStorage },
  ];

  // Navigation handler
  const handleNavigate = (demoId: string): void => {
    activeDemo = demoId;
  };

  // Sidebar toggle handler
  const toggleSidebar = (): void => {
    sidebarOpen = !sidebarOpen;
  };

  const currentDemo = $derived(demos.find(d => d.id === activeDemo) || demos[0]);
</script>

{#if $authState.isLoggedIn}
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Sidebar -->
    <Sidebar 
      {demos} 
      {activeDemo} 
      isOpen={sidebarOpen}
      onNavigate={handleNavigate}
      onToggle={toggleSidebar}
      onLogout={logout}
    />
    
    <!-- Main Content -->
    <main class="flex-1 overflow-auto lg:ml-0">
      <div class="min-h-full">
        <!-- Modern Header with Glass Effect -->
        <header class="sticky top-0 z-10 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 h-20">
          <div class="max-w-7xl mx-auto px-6 h-full">
            <div class="flex items-center justify-between h-full">
              <div class="flex items-center space-x-4">
                <!-- Hamburger Menu Button for Mobile -->
                <button
                  class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                  onclick={toggleSidebar}
                  title="Toggle Menu"
                >
                  <Menu class="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
                
                <div>
                  <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {currentDemo.name}
                  </h1>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Interactive demo and educational guide for the Drupal JS SDK
                  </p>
                </div>
              </div>
              
              <div class="hidden md:flex items-center space-x-2">
                <div class="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Demo Content with Modern Container -->
        <div class="max-w-7xl mx-auto px-6 py-8">
          {#key activeDemo}
            <currentDemo.component on:navigate={(e) => handleNavigate(e.detail)} />
          {/key}
        </div>
      </div>
    </main>
  </div>
{:else}
  <Login />
{/if}