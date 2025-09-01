<script lang="ts">
  import { drupal } from "../sdk";
  import CodeBlock from "../components/CodeBlock.svelte";
  import { Settings, Play, Info, Cpu, Globe, CheckCircle, XCircle } from "@lucide/svelte";
  import BestPractices from "../components/BestPractices.svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Button from "../components/Button.svelte";
  import Pills from "../components/Pills.svelte";
  import Footer from "../components/Footer.svelte";

  let systemInfo: any = null;
  let loading = false;
  let error: string | null = null;

  const loadSystemInfo = async () => {
    loading = true;
    error = null;
    
    try {
      // This would typically call a system endpoint
      systemInfo = {
        version: "1.0.0",
        baseURL: (drupal as any).config?.baseURL ?? "",
        modules: ["auth", "entity", "menu", "storage", "xhr"],
        initialized: true,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load system info";
    } finally {
      loading = false;
    }
  };

  // Load system info on mount
  import { onMount } from "svelte";
  onMount(() => {
    loadSystemInfo();
  });
</script>

<div class="space-y-6">
  <!-- Introduction -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <Settings class="w-6 h-6 mr-2" />
        Core SDK
      </h2>
      <p class="text-base-content/70">
        The Core module is the foundation of the Drupal JS SDK. It provides configuration management, 
        module orchestration, and the main Drupal class that coordinates all other SDK components.
      </p>
    </div>
  </div>

  <!-- System Information -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <SectionHeader title="System Information">
        <svelte:fragment slot="icon">
          <Info class="w-5 h-5" />
        </svelte:fragment>
        <svelte:fragment slot="actions">
          <Button 
            variant="primary" 
            size="sm"
            loading={loading}
            disabled={loading}
            on:click={loadSystemInfo}
          >
            <Play class="w-4 h-4 mr-2" />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </svelte:fragment>
      </SectionHeader>

      {#if error}
        <div class="alert alert-error">
          <span>{error}</span>
        </div>
      {:else if systemInfo}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
            <div class="stat-figure text-primary"><Settings class="w-8 h-8" /></div>
            <div class="stat-title">SDK Version</div>
            <div class="stat-value text-lg">{systemInfo.version}</div>
            <div class="stat-desc">Current release</div>
          </div>

          <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
            <div class="stat-figure text-secondary"><Globe class="w-8 h-8" /></div>
            <div class="stat-title">Base URL</div>
            <div class="stat-value text-sm break-all">{systemInfo.baseURL}</div>
            <div class="stat-desc">Drupal instance</div>
          </div>

          <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
            <div class="stat-figure text-accent"></div>
            <div class="stat-title">Modules</div>
            <div class="stat-value text-lg">{systemInfo.modules.length}</div>
            <div class="stat-desc">Available modules</div>
          </div>
        </div>

        <div class="mt-4">
          <h4 class="font-semibold mb-2">Available Modules:</h4>
          <div class="flex flex-wrap gap-2">
            {#each systemInfo.modules as module}
              <Pills variant="primary" size="sm">{module}</Pills>
            {/each}
          </div>
        </div>
      {:else}
        <div class="skeleton h-32 w-full"></div>
      {/if}
    </div>
  </div>

  <!-- Code Examples -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Basic Initialization -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Basic Initialization</h3>
        <CodeBlock 
          code={`import { Drupal } from '@drupal-js-sdk/core';

// Create main Drupal instance
const drupal = new Drupal({
  baseURL: 'https://your-drupal-url.example.com',
  apiPrefix: '/jsonapi',
  defaultHeaders: {
    'Content-Type': 'application/vnd.api+json'
  }
});

// All modules are now available
// Access core services:
// drupal.getClientService()  - HTTP client
// drupal.getSessionService() - Storage
// drupal.getConfigService()  - Configuration`}
          language="typescript"
          title="SDK Initialization"
        />
      </div>
    </div>

    <!-- Configuration Options -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Configuration Options</h3>
        <CodeBlock 
          code={`interface DrupalConfig {
  baseURL: string;           // Required: Drupal site URL
  apiPrefix?: string;        // API path (default: '/jsonapi')
  timeout?: number;          // Request timeout in ms
  withCredentials?: boolean; // Include cookies
  defaultHeaders?: Record<string, string>;
  storage?: {
    type: 'localStorage' | 'sessionStorage' | 'memory';
    prefix?: string;
  };
}

const drupal = new Drupal({
  baseURL: 'https://api.mysite.com',
  apiPrefix: '/api/v1',
  timeout: 30000,
  withCredentials: true,
  defaultHeaders: {
    'X-API-Version': '1.0'
  },
  storage: {
    type: 'localStorage',
    prefix: 'myapp_'
  }
});`}
          language="typescript"
          title="Advanced Configuration"
        />
      </div>
    </div>

    <!-- Module Access -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Module Access</h3>
        <CodeBlock 
          code={`// Access modules through the main instance
const drupal = new Drupal({ baseURL: 'https://site.com' });

// Import feature services separately
import { auth, entities, menu } from './sdk';

// Authentication service
await auth.login('user', 'pass');
const isLoggedIn = await auth.loginStatus();

// Entity service
const articles = await entities
  .node('article')
  .list();

// Menu service
const mainMenu = await menu.getMenu('main');

// Direct HTTP access via core
const response = await drupal.getClientService().get('/custom/endpoint');

// Storage via core session service
drupal.getSessionService().set('key', 'value');
const value = drupal.getSessionService().get('key');`}
          language="typescript"
          title="Module Integration"
        />
      </div>
    </div>

    <!-- Error Handling -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg">⚠ Error Handling</h3>
        <CodeBlock 
          code={`try {
  const drupal = new Drupal({
    baseURL: 'https://your-drupal-url.example.com'
  });
  
  // Test connection
  await drupal.getClientService().get('/system/status');

  
} catch (error) {
  if (error.message.includes('network')) {
    console.error('Network connection failed');
  } else if (error.message.includes('cors')) {
    console.error('CORS configuration issue');
  } else {
    console.error('Initialization failed:', error.message);
  }
  
  // Provide fallback or retry logic
}`}
          language="typescript"
          title="Initialization Error Handling"
        />
      </div>
    </div>

    <!-- Environment Detection -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Environment Detection</h3>
        <CodeBlock 
          code={`// SDK automatically detects environment
const drupal = new Drupal({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://prod.mysite.com'
    : 'https://dev.mysite.com'
});

// Browser vs Node.js detection is automatic
// - Browser: uses fetch() and localStorage
// - Node.js: uses node-fetch and memory storage

// Environment-specific configuration
if (typeof window !== 'undefined') {
  // Browser-specific setup
  drupal.config.withCredentials = true;
} else {
  // Node.js-specific setup
  drupal.config.timeout = 60000;
}`}
          language="typescript"
          title="Environment Adaptation"
        />
      </div>
    </div>

    <!-- Plugin System -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Plugin System</h3>
        <CodeBlock 
          code={`// Create custom plugin
class CustomPlugin {
  constructor(drupal) {
    this.drupal = drupal;
  }
  
  async customMethod() {
    return await this.drupal.getClientService().get('/custom/api');
  }
}

// Extend Drupal class
class ExtendedDrupal extends Drupal {
  constructor(config) {
    super(config);
    this.custom = new CustomPlugin(this);
  }
}

// Use extended version
const drupal = new ExtendedDrupal({
  baseURL: 'https://site.com'
});

await drupal.custom.customMethod();`}
          language="typescript"
          title="Custom Extensions"
        />
      </div>
    </div>
  </div>

  <!-- Architecture Overview -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title text-lg"> Architecture Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="text-2xl mb-2"></div>
          <h4 class="font-semibold">Core</h4>
          <p class="text-sm text-base-content/70">Configuration & orchestration</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="text-2xl mb-2"><Globe class="w-8 h-8" /></div>
          <h4 class="font-semibold">XHR</h4>
          <p class="text-sm text-base-content/70">HTTP client & requests</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="text-2xl mb-2"></div>
          <h4 class="font-semibold">Auth</h4>
          <p class="text-sm text-base-content/70">Authentication & sessions</p>
        </div>
        
        <div class="text-center p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="text-2xl mb-2"></div>
          <h4 class="font-semibold">Entity</h4>
          <p class="text-sm text-base-content/70">Content management</p>
        </div>
      </div>

      <CodeBlock 
        code={`// Dependency flow
Core
├── Config Management
├── Module Registration  
├── Environment Detection
└── Error Handling

XHR (HTTP Client)
├── Request/Response Interceptors
├── CSRF Token Handling
├── Error Management
└── Environment Adaptation (fetch/node-fetch)

Auth (Authentication)
├── Session Management
├── Token Handling
├── User Information
└── Login/Logout Flows

Entity (Content Management)
├── Fluent Query Builder
├── Relationship Loading
├── Type Safety
└── Caching`}
        language="text"
        title="Module Dependencies"
      />
    </div>
  </div>

  <BestPractices
    doItems={[
      "Initialize Drupal instance once and reuse it",
      "Set appropriate timeout values for your use case",
      "Use environment-specific configuration",
      "Handle initialization errors gracefully",
      "Leverage TypeScript for better development experience",
    ]}
    dontItems={[
      "Create multiple Drupal instances unnecessarily",
      "Ignore configuration validation errors",
      "Use hardcoded URLs in production",
      "Skip error handling during initialization",
      "Mix different SDK instances in the same application",
    ]}
  />

  <Footer />
</div>