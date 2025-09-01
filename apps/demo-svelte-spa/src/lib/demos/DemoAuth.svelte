<script lang="ts">
  import { auth } from "../sdk";
  import { authState } from "../authStore";
  import CodeBlock from "../components/CodeBlock.svelte";
  import CollapsibleCode from "../components/CollapsibleCode.svelte";
  import { Shield, Play, CheckCircle, XCircle, AlertCircle } from "@lucide/svelte";
  import BestPractices from "../components/BestPractices.svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import StatusCard from "../components/StatusCard.svelte";
  import Button from "../components/Button.svelte";
  import Footer from "../components/Footer.svelte";

  let testResults: Array<{
    method: string;
    description: string;
    result: string;
    success: boolean;
    code?: string;
  }> = [];

  let loading = false;

  const runAuthTests = async () => {
    loading = true;
    testResults = [];

    // Test 1: Check Login Status
    try {
      const isLoggedIn = await auth.loginStatus();
      testResults = [...testResults, {
        method: "loginStatus()",
        description: "Check if user is currently logged in",
        result: `User is ${isLoggedIn ? 'logged in' : 'not logged in'}`,
        success: true,
        code: `const isLoggedIn = await auth.loginStatus();`
      }];
    } catch (error) {
      testResults = [...testResults, {
        method: "loginStatus()",
        description: "Check if user is currently logged in", 
        result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      }];
    }

    // Test 2: Get Session Token
    try {
      const response = await auth.getSessionToken();
      let csrfToken: string = "";
      if (typeof response.data === "string") {
        csrfToken = response.data;
      } else {
        csrfToken = JSON.stringify(response.data);
      }
      testResults = [...testResults, {
        method: "getSessionToken()",
        description: "Retrieve CSRF session token for authenticated requests",
        result: `Token received: ${csrfToken.slice(0, 20)}...`,
        success: true,
        code: `const response = await auth.getSessionToken();\nconst token = typeof response.data === "string" ? response.data : JSON.stringify(response.data);`
      }];
    } catch (error) {
      testResults = [...testResults, {
        method: "getSessionToken()",
        description: "Retrieve CSRF session token for authenticated requests",
        result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      }];
    }

    // Test 3: Get User Info (if logged in)
    if ($authState.isLoggedIn) {
      try {
        const userInfo = auth.store.current_user;
        testResults = [...testResults, {
          method: "current_user",
          description: "Get current user information from auth.store",
          result: `User ID: ${userInfo?.uid ?? 'N/A'}, Name: ${userInfo?.name ?? 'N/A'}`,
          success: true,
          code: `// DrupalAuth exposes current user on the store\nconst user = auth.store.current_user;`
        }];
      } catch (error) {
        testResults = [...testResults, {
          method: "current_user",
          description: "Get current user information from auth.store",
          result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          success: false
        }];
      }
    }

    loading = false;
  };

  // Auto-run tests on component mount
  import { onMount } from "svelte";
  onMount(() => {
    runAuthTests();
  });
</script>

<div class="space-y-6">
  <!-- Introduction -->
  <div class="card bg-base-100 shadow-md rounded-2xl">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <Shield class="w-6 h-6 mr-2" />
        Authentication System
      </h2>
      <p class="text-base-content/70">
        The authentication module provides comprehensive user management for Drupal applications.
        It handles session tokens, CSRF protection, login/logout flows, and user information retrieval.
      </p>
    </div>
  </div>

  <!-- Current Status -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
    <div class="stat bg-base-100 shadow-md rounded-2xl h-full">
      <div class="stat-figure text-primary">
        <div class="w-8 h-8 rounded-full {$authState.isLoggedIn ? 'bg-success' : 'bg-error'} flex items-center justify-center">
          <span class="text-white text-sm">{$authState.isLoggedIn ? '[✓]' : '[✗]'}</span>
        </div>
      </div>
      <div class="stat-title">Status</div>
      <div class="stat-value text-lg">{$authState.isLoggedIn ? 'Logged In' : 'Not Logged In'}</div>
      <div class="stat-desc">{$authState.username || 'No active session'}</div>
    </div>

    <div class="stat bg-base-100 shadow-md rounded-2xl h-full">
      <div class="stat-figure text-secondary"><Shield class="w-8 h-8" /></div>
      <div class="stat-title">Protection</div>
      <div class="stat-value text-lg">CSRF</div>
      <div class="stat-desc">Session tokens active</div>
    </div>

    <div class="stat bg-base-100 shadow-md rounded-2xl h-full">
      <div class="stat-figure text-accent"><Shield class="w-8 h-8" /></div>
      <div class="stat-title">Session</div>
      <div class="stat-value text-lg">Active</div>
      <div class="stat-desc">Persistent storage</div>
    </div>
  </div>

  <!-- Interactive Tests -->
  <div class="card bg-base-100 shadow-md rounded-2xl">
    <div class="card-body">
      <SectionHeader title="Live API Tests">
        <svelte:fragment slot="icon">
          <Shield class="w-5 h-5" />
        </svelte:fragment>
        <svelte:fragment slot="actions">
          <Button 
            variant="primary" 
            size="sm"
            loading={loading}
            disabled={loading}
            on:click={runAuthTests}
          >
            <Play class="w-4 h-4 mr-2" />
            {loading ? 'Testing...' : 'Run Tests'}
          </Button>
        </svelte:fragment>
      </SectionHeader>

      {#if testResults.length > 0}
        <div class="space-y-3">
          {#each testResults as result}
            <StatusCard
              state={result.success ? 'success' : 'error'}
              method={result.method}
              description={result.description}
              resultText={result.result}
              code={result.code ?? null}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Code Examples -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    <!-- Basic Usage -->
    <div class="card bg-base-100 shadow-md rounded-2xl h-full">
      <div class="card-body">
        <h3 class="card-title text-lg">Basic Usage</h3>
        <CollapsibleCode 
          title="Initialize Authentication"
          code={`import { DrupalAuth } from '@drupal-js-sdk/auth';
import { Drupal } from '@drupal-js-sdk/core';

const drupal = new Drupal({
  baseURL: 'https://your-drupal-url.example.com'
});

const auth = new DrupalAuth(drupal);`}
        />
      </div>
    </div>

    <!-- Login Flow -->
    <div class="card bg-base-100 shadow-md rounded-2xl h-full">
      <div class="card-body">
        <h3 class="card-title text-lg">Login Flow</h3>
        <CollapsibleCode 
          title="Complete Login Process"
          code={`// Get session token first
await auth.getSessionToken();

// Login with credentials
await auth.login(username, password);

// Check login status
const isLoggedIn = await auth.loginStatus();`}
        />
      </div>
    </div>

    <!-- Error Handling -->
    <div class="card bg-base-100 shadow-md rounded-2xl h-full">
      <div class="card-body">
        <h3 class="card-title text-lg">⚠ Error Handling</h3>
        <CollapsibleCode 
          title="Robust Error Handling"
          code={`try {
  await auth.login(username, password);
} catch (error) {
  if (error.message.includes('401')) {

  } else {

  }
}`}
        />
      </div>
    </div>

    <!-- User Information -->
    <div class="card bg-base-100 shadow-md rounded-2xl h-full">
      <div class="card-body">
        <h3 class="card-title text-lg">User Information</h3>
        <CollapsibleCode 
          title="Accessing User Data"
          code={`// Get current user details
const user = await auth.getCurrentUser();

// Access user data:
// user.uid   - User ID
// user.name  - Username  
// user.mail  - Email
// user.roles - User roles`}
        />
      </div>
    </div>
  </div>

  <!-- Best Practices -->
  <BestPractices
    doItems={[
      "Always get session token before login",
      "Handle authentication errors gracefully",
      "Check login status on app initialization",
      "Use persistent storage for sessions",
    ]}
    dontItems={[
      "Store passwords in localStorage",
      "Skip CSRF token validation",
      "Ignore 401/403 error codes",
      "Make assumptions about user roles",
    ]}
  />

  <Footer />
</div>
