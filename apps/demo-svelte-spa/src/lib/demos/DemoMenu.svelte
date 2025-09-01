<script lang="ts">
  import { onMount } from "svelte";
  import { menu } from "../sdk";
  import CodeBlock from "../components/CodeBlock.svelte";
  import { Menu, Navigation, Play, List, CheckCircle, XCircle } from "@lucide/svelte";
  import StatusCard from "../components/StatusCard.svelte";
  import CollapsibleCode from "../components/CollapsibleCode.svelte";
  import BestPractices from "../components/BestPractices.svelte";
  import Button from "../components/Button.svelte";
  import Pills from "../components/Pills.svelte";
  import Footer from "../components/Footer.svelte";

  interface MenuNode {
    id: string;
    name: string;
    href: string;
    items?: MenuNode[];
  }

  let menuItems: MenuNode[] = [];
  let loading = false;
  let error: string | null = null;
  let selectedMenu = "main";
  let rawMenuData: any = null;
  let showRawData = false;

  const availableMenus = [
    { id: "main", name: "Main Navigation" },
    { id: "footer", name: "Footer Menu" },
    { id: "user", name: "User Account Menu" },
    { id: "tools", name: "Admin Tools" }
  ];

  const fetchMenu = async (menuName: string) => {
    loading = true;
    error = null;
    menuItems = [];
    rawMenuData = null;

    try {
      const items = await menu.getMenu(menuName);
      menuItems = items;
      
      // Also fetch raw data for educational purposes (linkset envelope)
      const raw = await menu.raw(menuName);
      rawMenuData = raw.data;
      
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load menu";
    } finally {
      loading = false;
    }
  };

  const renderMenuItems = (items: MenuNode[], level = 0): any => {
    if (!items || items.length === 0) return [];
    
    return items.map(item => ({
      ...item,
      level,
      children: item.items ? renderMenuItems(item.items, level + 1) : []
    }));
  };

  onMount(() => {
    fetchMenu(selectedMenu);
  });

  $: flatMenuItems = renderMenuItems(menuItems);
</script>

<div class="space-y-6">
  <!-- Introduction -->
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title text-2xl">
        <Menu class="w-6 h-6 mr-2" />
        Menu System
      </h2>
      <p class="text-base-content/70">
        The menu module provides easy access to Drupal's menu system. Fetch hierarchical menu structures,
        build navigation components, and access menu metadata through the Linkset API.
      </p>
    </div>
  </div>

  <!-- Menu Selector and Stats -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Select Menu</h3>
        <select 
          class="select select-bordered w-full"
          bind:value={selectedMenu}
          on:change={() => fetchMenu(selectedMenu)}
        >
          {#each availableMenus as menuOption}
            <option value={menuOption.id}>{menuOption.name}</option>
          {/each}
        </select>
        
        <Button 
          variant="primary" 
          size="sm"
          loading={loading}
          disabled={loading}
          on:click={() => fetchMenu(selectedMenu)}
        >
          <List class="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'Reload Menu'}
        </Button>
      </div>
    </div>

    <div class="stat bg-base-100 shadow-md">
      <div class="stat-figure text-primary"></div>
      <div class="stat-title">Menu Items</div>
      <div class="stat-value text-2xl">{flatMenuItems.length}</div>
      <div class="stat-desc">Total links found</div>
    </div>

    <div class="stat bg-base-100 shadow-md">
      <div class="stat-figure text-secondary"></div>
      <div class="stat-title">Max Depth</div>
      <div class="stat-value text-2xl">
        {Math.max(...flatMenuItems.map(item => item.level), 0) + 1}
      </div>
      <div class="stat-desc">Levels deep</div>
    </div>
  </div>

  <!-- Menu Display -->
  {#if loading}
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <div class="flex items-center justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <span class="ml-4">Loading menu data...</span>
        </div>
      </div>
    </div>
  {:else if error}
    <StatusCard state="error" title="Error loading menu" description={error} />
  {:else if menuItems.length > 0}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Rendered Menu -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title"> Rendered Menu</h3>
          <div class="menu bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
            {#each menuItems as item}
              <li>
                <a href={item.href} class="font-medium">{item.name}</a>
                {#if item.items && item.items.length > 0}
                  <ul>
                    {#each item.items as subItem}
                      <li>
                        <a href={subItem.href} class="text-sm">{subItem.name}</a>
                        {#if subItem.items && subItem.items.length > 0}
                          <ul>
                            {#each subItem.items as subSubItem}
                              <li>
                                <a href={subSubItem.href} class="text-xs opacity-75">
                                  {subSubItem.name}
                                </a>
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </li>
                    {/each}
                  </ul>
                {/if}
              </li>
            {/each}
          </div>
        </div>
      </div>

      <!-- Menu Tree -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title"> Menu Structure</h3>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Level</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {#each flatMenuItems as item}
                  <tr>
                    <td>
                      <span style="margin-left: {item.level * 20}px">
                        {#if item.level > 0}->{/if} {item.name}
                      </span>
                    </td>
                    <td>
                      <Pills variant="info" size="xs">{item.level}</Pills>
                    </td>
                    <td>
                      <code class="text-xs">{item.href}</code>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <StatusCard state="info" title="No menu data" description={`No menu items found for "${selectedMenu}" menu.`} />
  {/if}

  <!-- Raw Data Toggle -->
  {#if rawMenuData}
    <CollapsibleCode title="Raw Menu API Response" code={JSON.stringify(rawMenuData, null, 2)} />
  {/if}

  <!-- Code Examples -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Basic Usage -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Basic Usage</h3>
        <CodeBlock 
          code={`import { DrupalMenu } from '@drupal-js-sdk/menu';

const menu = new DrupalMenu(drupal);

// Get processed menu items
const items = await menu.getMenu('main');

// Get raw menu data
const raw = await menu.getRawMenu('main');`}
          language="typescript"
          title="Initialize and Fetch Menu"
        />
      </div>
    </div>

    <!-- Menu Navigation Component -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Navigation Component</h3>
        <CodeBlock 
          code={`// Svelte component example
const menuItems = await menu.getMenu('main');

// Template rendering
{#each menuItems as item}
  <a href={item.href}>{item.name}</a>
  {#if item.items}
    <ul>
      {#each item.items as subItem}
        <li><a href={subItem.href}>
          {subItem.name}
        </a></li>
      {/each}
    </ul>
  {/if}
{/each}`}
          language="typescript"
          title="Svelte Menu Component"
        />
      </div>
    </div>

    <!-- Error Handling -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg">⚠ Error Handling</h3>
        <CodeBlock 
          code={`try {
  const items = await menu.getMenu('main');
  // Use menu items
} catch (error) {
  if (error.message.includes('404')) {

  } else {

  }
}`}
          language="typescript"
          title="Graceful Error Handling"
        />
      </div>
    </div>

    <!-- Menu Structure -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title text-lg"> Menu Structure</h3>
        <CodeBlock 
          code={`interface MenuNode {
  id: string;      // Unique identifier
  name: string;    // Display name
  href: string;    // URL/path
  items?: MenuNode[]; // Child items
}

// Hierarchical structure
// Parent → Child → Grandchild`}
          language="typescript"
          title="Menu Data Structure"
        />
      </div>
    </div>
  </div>

  <BestPractices
    doItems={[
      "Cache menu data for better performance",
      "Handle missing menus gracefully",
      "Use semantic HTML for accessibility",
      "Consider mobile navigation patterns",
    ]}
    dontItems={[
      "Hardcode menu machine names",
      "Assume menus will always exist",
      "Ignore menu depth limitations",
      "Fetch menus on every page load",
    ]}
  />

  <Footer />
</div>

