<script lang="ts">
  import { drupal } from "../sdk";
  import CodeBlock from "../components/CodeBlock.svelte";
  import Button from "../components/Button.svelte";
  import Pills from "../components/Pills.svelte";
  import { Server, Globe, Play, Send, CheckCircle, XCircle, Sparkles, Zap } from "@lucide/svelte";
  import Footer from "../components/Footer.svelte";

  interface TestResult {
    method: string;
    url: string;
    description: string;
    success: boolean;
    responseTime: number;
    result: string;
    code: string;
  }

  let testResults: TestResult[] = [];
  let loading = false;

  const runHttpTests = async () => {
    loading = true;
    testResults = [];

    const tests = [
      {
        name: "GET Request",
        description: "Fetch system information",
        url: "/system/get",
        method: "GET",
        code: `const response = await drupal.getClientService().get('/system/get');`,
        test: () => drupal.getClientService().get('/system/get')
      },
      {
        name: "POST Request", 
        description: "Send data to server",
        url: "/test/post",
        method: "POST",
        code: `const response = await drupal.getClientService().post('/test/post', { data: 'test' });`,
        test: () => drupal.getClientService().post('/test/post', { data: 'test' })
      },
      {
        name: "Headers Test",
        description: "Custom headers handling",
        url: "/system/get",
        method: "GET",
        code: `const response = await drupal.getClientService().get('/system/get', {
  headers: { 'X-Custom': 'value' }
});`,
        test: () => drupal.getClientService().get('/system/get', { 
          headers: { 'X-Custom': 'value' } 
        })
      }
    ];

    for (const test of tests) {
      const startTime = performance.now();
      try {
        const response = await test.test();
        const endTime = performance.now();
        
        testResults = [...testResults, {
          method: test.method,
          url: test.url,
          description: test.description,
          success: true,
          responseTime: Math.round(endTime - startTime),
          result: `Status: ${response.status || 'Success'}`,
          code: test.code
        }];
      } catch (error) {
        const endTime = performance.now();
        testResults = [...testResults, {
          method: test.method,
          url: test.url,
          description: test.description,
          success: false,
          responseTime: Math.round(endTime - startTime),
          result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: test.code
        }];
      }
    }

    loading = false;
  };
</script>

<div class="space-y-6">
  <!-- Introduction -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <Server class="w-6 h-6 mr-2" />
        HTTP Client (XHR)
      </h2>
      <p class="text-base-content/70">
        The XHR module provides a powerful HTTP client with automatic CSRF token handling, request/response interceptors,
        error handling, and support for all HTTP methods. It's the foundation for all API communication.
      </p>
    </div>
  </div>

  <!-- Live HTTP Tests -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h3 class="card-title">
          <Globe class="w-5 h-5 mr-2" />
          Live HTTP Tests
        </h3>
        <Button 
          variant="primary"
          loading={loading}
          disabled={loading}
          on:click={runHttpTests}
        >
          <Play class="w-4 h-4 mr-2" />
          {loading ? 'Testing...' : 'Run HTTP Tests'}
        </Button>
      </div>

      {#if testResults.length > 0}
        <div class="space-y-4">
          {#each testResults as result}
            <div class="border rounded-lg p-4 {result.success ? 'border-success bg-success/5' : 'border-error bg-error/5'}">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <Pills variant={result.success ? 'success' : 'danger'} size="sm">
                    {result.success ? '[✓]' : '[✗]'}
                  </Pills>
                  <Pills variant="secondary" size="sm" outline>{result.method}</Pills>
                  <code class="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-mono">{result.url}</code>
                </div>
                <span class="text-sm text-base-content/70">{result.responseTime}ms</span>
              </div>
              
              <p class="text-sm text-base-content/70 mb-2">{result.description}</p>
              <p class="text-sm font-medium mb-3">{result.result}</p>
              
              <CodeBlock 
                code={result.code}
                language="typescript"
                title="Request Code"
              />
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-base-content/50">
          Click "Run HTTP Tests" to see live API requests
        </div>
      {/if}
    </div>
  </div>

  <!-- Code Examples -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Basic Usage -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Basic Usage</h3>
        <CodeBlock 
          code={`import { Drupal } from '@drupal-js-sdk/core';

const drupal = new Drupal({
  baseURL: 'https://your-drupal-url.example.com'
});

// GET request
const response = await drupal.getClientService().get('/jsonapi/node/article');

// POST request
const result = await drupal.getClientService().post('/jsonapi/node/article', {
  data: {
    type: 'node--article',
    attributes: { title: 'New Article' }
  }
});`}
          language="typescript"
          title="HTTP Client Basics"
        />
      </div>
    </div>

    <!-- Request Configuration -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Request Configuration</h3>
        <CodeBlock 
          code={`// Custom headers and options
const response = await drupal.getClientService().get('/api/endpoint', {
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  },
  params: {
    filter: 'published',
    sort: '-created'
  }
});

// Form data upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await drupal.getClientService().post('/file/upload', {
  data: formData
});`}
          language="typescript"
          title="Advanced Configuration"
        />
      </div>
    </div>

    <!-- Error Handling -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg">⚠ Error Handling</h3>
        <CodeBlock 
          code={`try {
  const response = await drupal.getClientService().get('/protected/resource');

} catch (error) {
  if (error.status === 401) {

  } else if (error.status === 403) {

  } else if (error.status >= 500) {

  } else {

  }
}`}
          language="typescript"
          title="Comprehensive Error Handling"
        />
      </div>
    </div>

    <!-- Interceptors -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Request Interceptors</h3>
        <CodeBlock 
          code={`// Add request interceptor
drupal.getClientService().addRequestInterceptor((config) => {
  // Add timestamp to all requests
  config.params = {
    ...config.params,
    timestamp: Date.now()
  };
  return config;
});

// Add response interceptor
drupal.getClientService().addResponseInterceptor(
  (response) => {
    // Transform successful responses

    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('Request failed:', error.message);
    throw error;
  }
);`}
          language="typescript"
          title="Request/Response Interceptors"
        />
      </div>
    </div>

    <!-- All HTTP Methods -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"><Globe class="w-8 h-8" /> HTTP Methods</h3>
        <CodeBlock 
          code={`// All supported HTTP methods
const getResponse = await drupal.getClientService().get('/api/data');
const postResponse = await drupal.getClientService().post('/api/data', { data });
const putResponse = await drupal.getClientService().put('/api/data/123', { data });
const patchResponse = await drupal.getClientService().patch('/api/data/123', { data });
const deleteResponse = await drupal.getClientService().delete('/api/data/123');
const headResponse = await drupal.getClientService().head('/api/status');
const optionsResponse = await drupal.getClientService().options('/api/info');

// Custom method
const customResponse = await drupal.getClientService().request({
  method: 'CUSTOM',
  url: '/api/custom',
  data: payload
});`}
          language="typescript"
          title="Complete HTTP Method Support"
        />
      </div>
    </div>

    <!-- Query Parameters -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Query Parameters</h3>
        <CodeBlock 
          code={`// Simple parameters
const response = await drupal.getClientService().get('/api/articles', {
  params: {
    page: 1,
    limit: 10,
    sort: '-created'
  }
});

// Array parameters
const filtered = await drupal.getClientService().get('/api/content', {
  params: {
    'filter[status]': '1',
    'filter[type][]': ['article', 'page'],
    'include[]': ['author', 'image']
  }
});

// Complex nested parameters
const complex = await drupal.getClientService().get('/jsonapi/node/article', {
  params: {
    'filter[title][condition][path]': 'title',
    'filter[title][condition][operator]': 'CONTAINS',
    'filter[title][condition][value]': 'news'
  }
});`}
          language="typescript"
          title="Query Parameter Handling"
        />
      </div>
    </div>
  </div>

  <!-- Features Overview -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title text-lg"><Sparkles class="w-5 h-5" /> Key Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="stat-figure text-primary"></div>
          <div class="stat-title">CSRF Protection</div>
          <div class="stat-value text-lg">Auto</div>
          <div class="stat-desc">Automatic token handling</div>
        </div>

        <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="stat-figure text-secondary"></div>
          <div class="stat-title">Interceptors</div>
          <div class="stat-value text-lg">Both</div>
          <div class="stat-desc">Request & Response</div>
        </div>

        <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="stat-figure text-accent"><Zap class="w-8 h-8" /></div>
          <div class="stat-title">Performance</div>
          <div class="stat-value text-lg">Fast</div>
          <div class="stat-desc">Optimized for speed</div>
        </div>

        <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="stat-figure text-info"></div>
          <div class="stat-title">Type Safety</div>
          <div class="stat-value text-lg">Full</div>
          <div class="stat-desc">TypeScript support</div>
        </div>

        <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="stat-figure text-success"></div>
          <div class="stat-title">Configurable</div>
          <div class="stat-value text-lg">Yes</div>
          <div class="stat-desc">Flexible options</div>
        </div>

        <div class="stat bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          <div class="stat-figure text-warning"></div>
          <div class="stat-title">Universal</div>
          <div class="stat-value text-lg">Both</div>
          <div class="stat-desc">Browser & Node.js</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Best Practices -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title text-lg"> Best Practices</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold mb-3 text-success"><CheckCircle class="w-5 h-5" /> Do</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Use appropriate HTTP methods for operations
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Handle errors with specific status codes
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Set proper Content-Type headers
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Use interceptors for common functionality
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Validate responses before using data
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3 text-error"><XCircle class="w-5 h-5" /> Don't</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Ignore HTTP status codes in responses
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Make requests without error handling
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Skip CSRF token validation
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Use GET requests for data mutations
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Send sensitive data in query parameters
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>