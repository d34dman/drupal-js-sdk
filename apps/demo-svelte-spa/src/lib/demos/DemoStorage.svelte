<script lang="ts">
  import { drupal } from "../sdk";
  import CodeBlock from "../components/CodeBlock.svelte";
  import Button from "../components/Button.svelte";
  import { Save, Trash2, Eye, Database, CheckCircle, XCircle } from "@lucide/svelte";
  import Pills from "../components/Pills.svelte";
  import Footer from "../components/Footer.svelte";

  let storedItems: Array<{ key: string; value: any; type: string }> = [];
  let newKey = "";
  let newValue = "";
  let selectedType = "string";

  const loadStoredItems = () => {
    // Get all items from storage (this is a demo, so we'll simulate)
    const demoItems = [
      { key: "user_preferences", value: { theme: "dark", language: "en" }, type: "object" },
      { key: "session_token", value: "abc123def456", type: "string" },
      { key: "last_login", value: new Date().toISOString(), type: "string" },
      { key: "cart_items", value: [1, 2, 3], type: "array" }
    ];
    storedItems = demoItems;
  };

  const addItem = () => {
    if (!newKey || !newValue) return;
    
    let parsedValue = newValue;
    if (selectedType === "object" || selectedType === "array") {
      try {
        parsedValue = JSON.parse(newValue);
      } catch (e) {
        alert("Invalid JSON format");
        return;
      }
    } else if (selectedType === "number") {
      parsedValue = Number(newValue);
    } else if (selectedType === "boolean") {
      parsedValue = newValue.toLowerCase() === "true";
    }

    // Store in actual storage
    drupal.getSessionService().set(newKey, parsedValue);
    
    // Update display
    storedItems = [...storedItems, { key: newKey, value: parsedValue, type: selectedType }];
    newKey = "";
    newValue = "";
  };

  const removeItem = (key: string) => {
    drupal.getSessionService().remove(key);
    storedItems = storedItems.filter(item => item.key !== key);
  };

  const clearAll = () => {
    storedItems.forEach(item => drupal.getSessionService().remove(item.key));
    storedItems = [];
  };

  // Load items on mount
  import { onMount } from "svelte";
  onMount(() => {
    loadStoredItems();
  });
</script>

<div class="space-y-6">
  <!-- Introduction -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <Database class="w-6 h-6 mr-2" />
        Storage Management
      </h2>
      <p class="text-base-content/70">
        The Storage module provides a unified interface for persistent data storage across different environments.
        It automatically selects the best storage mechanism (localStorage, sessionStorage, or memory) and handles
        serialization of complex data types.
      </p>
    </div>
  </div>

  <!-- Interactive Storage Demo -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title"> Interactive Storage Demo</h3>
      
      <!-- Add New Item -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="form-control">
          <label class="label" for="key-input">
            <span class="label-text">Key</span>
          </label>
          <input 
            id="key-input"
            type="text" 
            placeholder="storage_key" 
            class="input input-bordered w-full" 
            bind:value={newKey}
          />
        </div>
        
        <div class="form-control">
          <label class="label" for="type-select">
            <span class="label-text">Type</span>
          </label>
          <select id="type-select" class="select select-bordered w-full" bind:value={selectedType}>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="object">Object</option>
            <option value="array">Array</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label" for="value-input">
            <span class="label-text">Value</span>
          </label>
          <input 
            id="value-input"
            type="text" 
            placeholder={selectedType === "object" ? '{"key": "value"}' : selectedType === "array" ? '[1,2,3]' : 'value'} 
            class="input input-bordered w-full" 
            bind:value={newValue}
          />
        </div>
        
        <div class="flex flex-col">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action</div>
          <Button variant="primary" size="md" on:click={addItem}>
            <Save class="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <!-- Stored Items -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-semibold">Stored Items ({storedItems.length})</h4>
          <Button variant="danger" size="sm" on:click={clearAll} disabled={storedItems.length === 0}>
            <Trash2 class="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
        
        {#if storedItems.length > 0}
          <div class="space-y-3">
            {#each storedItems as item}
              <div class="flex items-center justify-between p-4 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <code class="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-medium">{item.key}</code>
                    <Pills 
                      variant={
                        item.type === 'string' ? 'primary' :
                        item.type === 'number' ? 'success' :
                        item.type === 'boolean' ? 'warning' :
                        'info'
                      }
                      size="sm"
                    >
                      {item.type}
                    </Pills>
                  </div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/30 px-3 py-2 rounded-lg">
                    {typeof item.value === "object" ? JSON.stringify(item.value) : String(item.value)}
                  </div>
                </div>
                <Button variant="danger" size="xs" on:click={() => removeItem(item.key)}>
                  <XCircle class="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-base-content/50">
            No items stored. Add some items above to see them here.
          </div>
        {/if}
      </div>
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

// Store simple values
drupal.getSessionService().set('username', 'john_doe');
drupal.getSessionService().set('theme', 'dark');
drupal.getSessionService().set('notifications', true);

// Retrieve values
const username = drupal.getSessionService().get('username');
const theme = drupal.getSessionService().get('theme');
const notifications = drupal.getSessionService().get('notifications');

// Check existence
if (drupal.getSessionService().has('username')) {

}`}
          language="typescript"
          title="Simple Storage Operations"
        />
      </div>
    </div>

    <!-- Complex Data Types -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Complex Data Types</h3>
        <CodeBlock 
          code={`// Store objects
const userProfile = {
  id: 123,
  name: 'John Doe',
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true
  }
};
drupal.getSessionService().set('user_profile', userProfile);

// Store arrays
const recentItems = [
  { id: 1, title: 'Article 1' },
  { id: 2, title: 'Article 2' }
];
drupal.getSessionService().set('recent_items', recentItems);

// Retrieve with type safety
const profile = drupal.getSessionService().get<typeof userProfile>('user_profile');
const items = drupal.getSessionService().get<typeof recentItems>('recent_items');`}
          language="typescript"
          title="Complex Data Handling"
        />
      </div>
    </div>

    <!-- Storage Configuration -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Storage Configuration</h3>
        <CodeBlock 
          code={`// Configure storage type and prefix
const drupal = new Drupal({
  baseURL: 'https://site.com',
  storage: {
    type: 'localStorage',    // 'localStorage', 'sessionStorage', 'memory'
    prefix: 'myapp_'         // Prefix all keys
  }
});

// Storage will use keys like: 'myapp_username', 'myapp_theme'

// Environment-specific behavior:
// Browser: localStorage/sessionStorage
// Node.js: In-memory storage
// React Native: AsyncStorage (if available)

// Manual storage type selection
drupal.getSessionService().setStorageType('sessionStorage');`}
          language="typescript"
          title="Storage Configuration"
        />
      </div>
    </div>

    <!-- Default Values -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Default Values</h3>
        <CodeBlock 
          code={`// Get with default values
const theme = drupal.getSessionService().get('theme', 'light');
const language = drupal.getSessionService().get('language', 'en');
const settings = drupal.getSessionService().get('settings', {
  notifications: true,
  autoSave: false
});

// Safe type retrieval
interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

const userSettings = drupal.getSessionService().get<UserSettings>('user_settings', {
  theme: 'light',
  language: 'en',
  notifications: true
});`}
          language="typescript"
          title="Default Values & Type Safety"
        />
      </div>
    </div>

    <!-- Bulk Operations -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Bulk Operations</h3>
        <CodeBlock 
          code={`// Set multiple values at once
drupal.getSessionService().setMultiple({
  'user_id': 123,
  'session_token': 'abc123',
  'last_activity': new Date().toISOString(),
  'preferences': {
    theme: 'dark',
    language: 'en'
  }
});

// Get multiple values
const values = drupal.getSessionService().getMultiple([
  'user_id',
  'session_token', 
  'preferences'
]);

// Access stored values: values
// { user_id: 123, session_token: 'abc123', preferences: {...} }

// Remove multiple keys
drupal.getSessionService().removeMultiple(['temp_data', 'cache_*']);`}
          language="typescript"
          title="Efficient Bulk Operations"
        />
      </div>
    </div>

    <!-- Storage Events -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Storage Events</h3>
        <CodeBlock 
          code={`// Listen for storage changes
drupal.getSessionService().on('change', (event) => {
  // Handle storage change event
  // event.key, event.oldValue, event.newValue, event.action
});

// Listen for specific key changes
drupal.getSessionService().on('change:user_preferences', (event) => {
  // Handle user preferences update: event.newValue
});

// Storage size monitoring
drupal.getSessionService().on('quotaExceeded', () => {
  console.warn('Storage quota exceeded, cleaning up...');
  drupal.getSessionService().cleanup();
});`}
          language="typescript"
          title="Storage Event Handling"
        />
      </div>
    </div>
  </div>

  <!-- Storage Types Comparison -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title text-lg"> Storage Types Comparison</h3>
      <div class="overflow-x-auto">
        <table class="w-full border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <thead class="bg-slate-50 dark:bg-slate-800/50">
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Storage Type</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Persistence</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Size Limit</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Environment</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Use Case</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-900/50">
            <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200">
              <td class="px-6 py-4">
                <code class="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-medium">localStorage</code>
              </td>
              <td class="px-6 py-4">
                <Pills variant="success" size="sm">Persistent</Pills>
              </td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">~5-10MB</td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">Browser only</td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">User preferences, long-term data</td>
            </tr>
            <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200">
              <td class="px-6 py-4">
                <code class="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-medium">sessionStorage</code>
              </td>
              <td class="px-6 py-4">
                <Pills variant="warning" size="sm">Session only</Pills>
              </td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">~5-10MB</td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">Browser only</td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">Temporary data, current session</td>
            </tr>
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200">
              <td class="px-6 py-4">
                <code class="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-medium">memory</code>
              </td>
              <td class="px-6 py-4">
                <Pills variant="danger" size="sm">Volatile</Pills>
              </td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">Available RAM</td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">Any</td>
              <td class="px-6 py-4 text-slate-700 dark:text-slate-300">Caching, Node.js, testing</td>
            </tr>
          </tbody>
        </table>
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
              Use meaningful, namespaced keys
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Provide default values for get() operations
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Handle storage quota exceeded errors
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Use TypeScript interfaces for complex data
            </li>
            <li class="flex items-start gap-2">
              <span class="text-success">•</span>
              Clean up unused storage periodically
            </li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-3 text-error"><XCircle class="w-5 h-5" /> Don't</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Store sensitive data without encryption
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Assume storage is always available
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Store large binary data in localStorage
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Use storage for frequently changing data
            </li>
            <li class="flex items-start gap-2">
              <span class="text-error">•</span>
              Ignore storage event listeners in production
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</div>