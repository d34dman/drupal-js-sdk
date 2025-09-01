<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CodeBlock from "../components/CodeBlock.svelte";
  import Footer from "../components/Footer.svelte";
  import { Package, Type, Shield, Settings, Database, Menu as MenuIcon, Server, BookOpen, ExternalLink, BookmarkCheck, TestTube, Parentheses, Smartphone, Globe, Monitor, Terminal, Layers, Workflow } from "@lucide/svelte";

  const dispatch = createEventDispatcher();
  
  const features: Array<{ icon: any; title: string; description: string; highlights: string[]; gradient: string }> = [
    { icon: Settings, title: "Core", description: "Foundation SDK with configuration management and module orchestration", highlights: ["Environment detection", "Plugin system", "Type safety"], gradient: "from-blue-500 to-indigo-600" },
    { icon: Shield, title: "Authentication", description: "Complete user authentication with session management and CSRF protection", highlights: ["Login/logout flows", "Session tokens", "User information"], gradient: "from-emerald-500 to-teal-600" },
    { icon: Database, title: "Entity Management", description: "Powerful content management with fluent query builders and relationships", highlights: ["Fluent queries", "Type safety", "Relationship loading"], gradient: "from-purple-500 to-fuchsia-600" },
    { icon: MenuIcon, title: "Menu System", description: "Navigate and manage Drupal menus with hierarchical structure support", highlights: ["Menu trees", "Link management", "Custom menus"], gradient: "from-amber-500 to-orange-600" },
    { icon: Server, title: "HTTP Client", description: "Robust HTTP client with interceptors, error handling, and environment adaptation", highlights: ["Request interceptors", "CSRF tokens", "Environment adaptive"], gradient: "from-cyan-500 to-sky-600" },
    { icon: BookOpen, title: "Storage", description: "Unified storage interface supporting localStorage, sessionStorage, and memory", highlights: ["Cross-platform", "Type serialization", "Event system"], gradient: "from-rose-500 to-pink-600" }
  ];

  const stats = {
    modules: 6,
    methods: "40+",
    typescript: "100%",
    coverage: "Tests"
  };

  function navigateTo(section: string): void {

    const map: Record<string, string> = {
      Core: "core",
      Authentication: "auth",
      "Entity Management": "entity",
      "Menu System": "menu",
      "HTTP Client": "xhr",
      Storage: "storage",
    };
    const id = map[section];

    if (id) {
      dispatch("navigate", id);

    }
  }

  function scrollToDemos(): void {
    const demosSection = document.getElementById("demos-section");
    if (demosSection) {

      
      // Find the scrollable container (main element)
      const mainElement = document.querySelector('main');
      const headerHeight = document.querySelector("header")?.clientHeight || 100;
      
      if (mainElement) {
        // Calculate position relative to the main scrollable container
        const mainRect = mainElement.getBoundingClientRect();
        const demoRect = demosSection.getBoundingClientRect();
        const relativePosition = demoRect.top - mainRect.top + mainElement.scrollTop - headerHeight;
        mainElement.scrollTo({
          top: relativePosition,
          behavior: "smooth"
        });
      } else {
        // Fallback to window scroll
        const elementPosition = demosSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth"
        });
      }

    }
  }
</script>

<div class="space-y-8">
  <!-- Modern Hero Section -->
  <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
    
    <div class="relative px-6 md:px-8 py-12 md:py-16 text-center">
      <div class="max-w-4xl mx-auto">
        <!-- Icon with glow effect -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Package class="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
          Drupal JS SDK
        </h1>
        
        <p class="text-xl md:text-2xl mb-8 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          A comprehensive TypeScript SDK for building modern applications with Drupal APIs.
          <span class="block mt-2 text-lg text-slate-500 dark:text-slate-400">
            Featuring authentication, entity management, menu systems, and more.
          </span>
        </p>
        
        <!-- Modern Badge Pills -->
        <div class="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            TypeScript
          </span>
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
            JSON:API
          </span>
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700">
            REST API
          </span>
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700">
            Universal
          </span>
        </div>
        
        <!-- CTA Button -->
        <div class="flex justify-center">
          <button 
            class="group inline-flex items-center px-7 md:px-8 py-3.5 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            on:click={scrollToDemos}
          >
            <span>Explore Demos</span>
            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modern Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
    <div class="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Package class="w-6 h-6 text-white" />
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-slate-900 dark:text-white">{stats.modules}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Modules</div>
        </div>
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-300">Core components</div>
    </div>
    
    <div class="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <Parentheses class="w-6 h-6 text-white" />
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-slate-900 dark:text-white">{stats.methods}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Methods</div>
        </div>
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-300">Available APIs</div>
    </div>
    
    <div class="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Type class="w-6 h-6 text-white" />
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-slate-900 dark:text-white">{stats.typescript}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">TypeScript</div>
        </div>
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-300">Type coverage</div>
    </div>
    
    <div class="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <TestTube class="w-6 h-6 text-white" />
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-slate-900 dark:text-white">{stats.coverage}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tests</div>
        </div>
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-300">Code coverage</div>
    </div>
  </div>

  <!-- Features Grid -->
  <div id="demos-section" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
    {#each features as feature}
      <button type="button" on:click={() => navigateTo(feature.title)} class="text-left card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl h-full cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
        <div class="card-body">
          <div class="flex items-center justify-between mb-3">
            <div class="w-11 h-11 bg-gradient-to-br {feature.gradient} rounded-xl flex items-center justify-center shadow-md">
              <svelte:component this={feature.icon} class="w-5 h-5 text-white" />
            </div>
            <ExternalLink class="w-4 h-4 text-slate-400" />
          </div>
          <h3 class="card-title text-lg">{feature.title}</h3>
          <p class="text-base-content/70 mb-4">{feature.description}</p>
          <div class="space-y-1">
            {#each feature.highlights as highlight}
              <div class="flex items-center gap-2">
                <span class="text-success text-sm">[✓]</span>
                <span class="text-sm">{highlight}</span>
              </div>
            {/each}
          </div>
        </div>
      </button>
    {/each}
  </div>

  <!-- Getting Started -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Installation -->
    <div class="card bg-base-100 shadow-md rounded-2xl">
      <div class="card-body">
        <h3 class="card-title text-lg">Installation</h3>
        <CodeBlock 
          code={`# Install the main SDK package
npm install @drupal-js-sdk/drupal-js-sdk

# Or install individual modules
npm install @drupal-js-sdk/core
npm install @drupal-js-sdk/auth
npm install @drupal-js-sdk/entity
npm install @drupal-js-sdk/menu

# TypeScript definitions included!`}
          language="bash"
          title="Package Installation"
        />
      </div>
    </div>

    <!-- Quick Start -->
    <div class="card bg-base-100 shadow-md rounded-2xl">
      <div class="card-body">
        <h3 class="card-title text-lg">Quick Start</h3>
        <CodeBlock 
          code={`import { Drupal } from '@drupal-js-sdk/core';

// Initialize the SDK
const drupal = new Drupal({
  baseURL: 'https://your-drupal-url.example.com'
});

// Authentication
await drupal.auth.login('username', 'password');

// Fetch content
const articles = await drupal.entity
  .node('article')
  .include(['field_image', 'uid'])
  .list();

// Get menu
const menu = await drupal.menu.getMenu('main');`}
          language="typescript"
          title="Basic Usage Example"
        />
      </div>
    </div>
  </div>

  <!-- Architecture Overview -->
  <div class="card bg-base-100 shadow-md rounded-2xl">
    <div class="card-body">
      <h3 class="card-title text-lg">Architecture Overview</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold mb-3">Module Structure</h4>
          <CodeBlock 
            code={`drupal-js-sdk/
├── core/           # Foundation & configuration
├── auth/           # Authentication & sessions
├── entity/         # Content management
├── menu/           # Navigation & menus
├── storage/        # Data persistence
├── xhr/            # HTTP client
└── interfaces/     # TypeScript definitions`}
            language="text"
            title="Package Structure"
          />
        </div>
        <div>
          <h4 class="font-semibold mb-3">Key Benefits</h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="text-success"><BookmarkCheck class="w-8 h-8" /></span>
              <div>
                <strong>Type Safe</strong>
                <p class="text-sm text-base-content/70">Full TypeScript support with strict type checking</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-success"><BookmarkCheck class="w-8 h-8" /></span>
              <div>
                <strong>Universal</strong>
                <p class="text-sm text-base-content/70">Works in browsers and Node.js.</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-success"><BookmarkCheck class="w-8 h-8" /></span>
              <div>
                <strong>Performance</strong>
                <p class="text-sm text-base-content/70">Optimized queries and performance.</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-success"><BookmarkCheck class="w-8 h-8" /></span>
              <div>
                <strong>Extensible</strong>
                <p class="text-sm text-base-content/70">Plugin system for custom functionality</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Use Cases -->
  <div class="card bg-base-100 shadow-md rounded-2xl">
    <div class="card-body">
      <h3 class="card-title text-lg">Common Use Cases</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Smartphone class="w-6 h-6 text-white" />
          </div>
          <h4 class="font-semibold mb-2">Mobile Apps</h4>
          <p class="text-sm text-base-content/70">React Native, Ionic, or hybrid mobile applications</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Globe class="w-6 h-6 text-white" />
          </div>
          <h4 class="font-semibold mb-2">Web Applications</h4>
          <p class="text-sm text-base-content/70">React, Vue, Angular, or vanilla JavaScript SPAs</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Monitor class="w-6 h-6 text-white" />
          </div>
          <h4 class="font-semibold mb-2">Desktop Apps</h4>
          <p class="text-sm text-base-content/70">Electron, Tauri, or Progressive Web Apps</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Terminal class="w-6 h-6 text-white" />
          </div>
          <h4 class="font-semibold mb-2">Node.js Services</h4>
          <p class="text-sm text-base-content/70">Backend services, APIs, and automation scripts</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Layers class="w-6 h-6 text-white" />
          </div>
          <h4 class="font-semibold mb-2">JAMstack Sites</h4>
          <p class="text-sm text-base-content/70">Static sites with dynamic content from Drupal</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Workflow class="w-6 h-6 text-white" />
          </div>
          <h4 class="font-semibold mb-2">Headless CMS</h4>
          <p class="text-sm text-base-content/70">Decoupled architectures with Drupal as backend</p>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>